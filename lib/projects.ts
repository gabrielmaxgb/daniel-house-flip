export type Project = {
  id: string
  index: string
  title: string
  neighborhood: string
  year: number
  duration: string
  area: string
  what: string
  image: string
  before: string
  after: string
}

type ProjectCatalog = {
  projects: Project[]
}

const u = (id: string, w = 2000) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=82`

/**
 * Vitrine local — obras em destaque no site.
 * Troque por `/obras/<id>.webp` em public/ quando tiver fotos reais.
 */
export const featuredProjects: Project[] = [
  {
    id: "sqn-209",
    index: "01",
    title: "SQN 209",
    neighborhood: "Asa Norte",
    year: 2024,
    duration: "4 meses",
    area: "186 m²",
    what: "Reforma de fachada, pisos, cozinha e instalações elétricas. O imóvel estava desocupado desde o inventário.",
    image: u("photo-1600596542815-ffad4c1539a9"),
    before: u("photo-1568605114967-8130f3a36994"),
    after: u("photo-1600210492486-724fe5c67fb0"),
  },
  {
    id: "lago-sul",
    index: "02",
    title: "QI 15",
    neighborhood: "Lago Sul",
    year: 2025,
    duration: "6 meses",
    area: "320 m²",
    what: "Reforma integral: jardim, suíte principal e área gourmet.",
    image: u("photo-1613490493576-7fde63acd811"),
    before: u("photo-1480074568708-e7b720bb3f09"),
    after: u("photo-1600607687939-ce8a6c25118c"),
  },
  {
    id: "sudoeste",
    index: "03",
    title: "CLSW 103",
    neighborhood: "Sudoeste",
    year: 2024,
    duration: "3 meses",
    area: "98 m²",
    what: "Reorganização do layout, iluminação e banheiros. Apartamento de 98 m².",
    image: u("photo-1600210492493-0946911123ea"),
    before: u("photo-1554995207-c18c203602cb"),
    after: u("photo-1600566753086-00f18fb6b3ea"),
  },
  {
    id: "asa-sul",
    index: "04",
    title: "SQS 308",
    neighborhood: "Asa Sul",
    year: 2023,
    duration: "4 meses",
    area: "142 m²",
    what: "Estrutura preservada; acabamentos refeitos. Superquadra, quatro meses de obra.",
    image: u("photo-1613977257363-707ba9348227"),
    before: u("photo-1505693416388-ac5ce068fe85"),
    after: u("photo-1600573472592-401b489a3cdc"),
  },
]

function resolveAssetUrl(path: string, baseUrl: string): string {
  if (/^https?:\/\//i.test(path)) return path
  const base = baseUrl.replace(/\/$/, "")
  return `${base}/${path.replace(/^\//, "")}`
}

function resolveProjects(projects: Project[], baseUrl: string): Project[] {
  return projects.map((project) => ({
    ...project,
    image: resolveAssetUrl(project.image, baseUrl),
    before: resolveAssetUrl(project.before, baseUrl),
    after: resolveAssetUrl(project.after, baseUrl),
  }))
}

function getProjectsJsonUrl(): string | null {
  if (process.env.PROJECTS_JSON_URL) {
    return process.env.PROJECTS_JSON_URL
  }

  const base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/$/, "")
  if (!base) return null

  return `${base}/projects.json`
}

/** Dormant — ative com PROJECTS_SOURCE=r2 no .env */
async function fetchProjectsFromR2(): Promise<Project[] | null> {
  const jsonUrl = getProjectsJsonUrl()
  const baseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/$/, "")
  if (!jsonUrl || !baseUrl) return null

  try {
    const response = await fetch(jsonUrl, {
      next: { revalidate: 60 },
    })

    if (!response.ok) return null

    const catalog = (await response.json()) as ProjectCatalog
    if (!Array.isArray(catalog.projects) || catalog.projects.length === 0) {
      return null
    }

    const projects = resolveProjects(catalog.projects, baseUrl)

    if (process.env.PROJECTS_MEDIA_ON_R2 === "true") {
      return projects
    }

    return projects.map((project) => {
      const local = featuredProjects.find((item) => item.id === project.id)
      if (!local) return project

      return {
        ...project,
        image: local.image,
        before: local.before,
        after: local.after,
      }
    })
  } catch {
    return null
  }
}

export async function getProjects(): Promise<Project[]> {
  if (process.env.PROJECTS_SOURCE === "r2") {
    const remote = await fetchProjectsFromR2()
    if (remote) return remote
  }

  return featuredProjects
}
