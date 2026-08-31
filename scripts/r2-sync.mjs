#!/usr/bin/env node

/**
 * Sync data/projects.json + data/media/** to Cloudflare R2.
 *
 * Required env (.env.local):
 *   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME
 *
 * Usage:
 *   npm run r2:sync
 *   npm run r2:sync -- --dry-run
 *   npm run r2:sync -- --project sqn-209
 */

import { readFileSync, readdirSync, statSync } from "node:fs"
import { basename, join, relative } from "node:path"
import { fileURLToPath } from "node:url"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..")
const dataDir = join(root, "data")
const mediaDir = join(dataDir, "media")
const catalogPath = join(dataDir, "projects.json")

const args = process.argv.slice(2)
const dryRun = args.includes("--dry-run")
const projectFlagIndex = args.indexOf("--project")
const projectFilter =
  projectFlagIndex >= 0 ? args[projectFlagIndex + 1] : undefined

loadEnvFile(join(root, ".env.local"))

const accountId = requireEnv("R2_ACCOUNT_ID")
const accessKeyId = requireEnv("R2_ACCESS_KEY_ID")
const secretAccessKey = requireEnv("R2_SECRET_ACCESS_KEY")
const bucket = requireEnv("R2_BUCKET_NAME")

const client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId, secretAccessKey },
})

const contentTypes = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".avif": "image/avif",
  ".json": "application/json",
}

function requireEnv(name) {
  const value = process.env[name]?.trim()
  if (!value) {
    console.error(`Missing ${name} in .env.local`)
    process.exit(1)
  }
  return value
}

function loadEnvFile(path) {
  try {
    const lines = readFileSync(path, "utf8").split("\n")
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith("#")) continue
      const eq = trimmed.indexOf("=")
      if (eq === -1) continue
      const key = trimmed.slice(0, eq).trim()
      let value = trimmed.slice(eq + 1).trim()
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }
      if (!(key in process.env)) {
        process.env[key] = value
      }
    }
  } catch {
    console.error("Could not read .env.local")
    process.exit(1)
  }
}

function walkFiles(dir) {
  const entries = readdirSync(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath))
    } else if (entry.isFile() && !basename(fullPath).startsWith(".")) {
      files.push(fullPath)
    }
  }

  return files
}

function contentTypeFor(filePath) {
  const ext = filePath.slice(filePath.lastIndexOf(".")).toLowerCase()
  return contentTypes[ext] ?? "application/octet-stream"
}

async function upload(key, filePath, cacheControl) {
  const body = readFileSync(filePath)
  const contentType = contentTypeFor(filePath)

  if (dryRun) {
    console.log(`[dry-run] ${key} (${contentType}, ${body.byteLength} bytes)`)
    return
  }

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: cacheControl,
    }),
  )

  console.log(`uploaded ${key}`)
}

async function main() {
  const uploads = []

  uploads.push({
    key: "projects.json",
    filePath: catalogPath,
    cacheControl: "public, max-age=60",
  })

  if (statSync(mediaDir).isDirectory()) {
    for (const filePath of walkFiles(mediaDir)) {
      const rel = relative(dataDir, filePath).split("\\").join("/")

      if (projectFilter) {
        const prefix = `media/${projectFilter}/`
        if (!rel.startsWith(prefix)) continue
      }

      uploads.push({
        key: rel,
        filePath,
        cacheControl: "public, max-age=31536000, immutable",
      })
    }
  }

  if (uploads.length === 1) {
    console.warn(
      "No files in data/media/. Add photos under data/media/<project-id>/ before syncing.",
    )
  }

  for (const item of uploads) {
    await upload(item.key, item.filePath, item.cacheControl)
  }

  console.log(`\nDone.${dryRun ? " (dry-run)" : ""}`)
  const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/$/, "")
  if (publicUrl) {
    console.log(`Catalog: ${publicUrl}/projects.json`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
