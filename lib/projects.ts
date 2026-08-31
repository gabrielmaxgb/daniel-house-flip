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

/** Placeholders while R2 is not configured or media is missing locally. */
export const fallbackProjects: Project[] = [
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
    id: "park-way",
    index: "04",
    title: "Conjunto 8",
    neighborhood: "Park Way",
    year: 2025,
    duration: "5 meses",
    area: "240 m²",
    what: "Ampliação da sala e substituição das esquadrias. Casa em fundo de lote.",
    image: u("photo-1600585154526-990dced4db0d"),
    before: u("photo-1564013799919-ab600027ffc6"),
    after: u("photo-1600047509782-20d39509f26d"),
  },
  {
    id: "asa-sul",
    index: "05",
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
  {
    id: "noroeste",
    index: "06",
    title: "SQNW 107",
    neighborhood: "Noroeste",
    year: 2025,
    duration: "4 meses",
    area: "168 m²",
    what: "Unidade entregue incompleta. Conclusão dos acabamentos deixados em aberto pela construtora.",
    image: u("photo-1600566753190-17f0baa2a6c3"),
    before: u("photo-1522708323590-d24dbb6b0267"),
    after: u("photo-1600607687920-4e2a09cf159d"),
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

export async function getProjects(): Promise<Project[]> {
  const jsonUrl = getProjectsJsonUrl()
  const baseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/$/, "")

  if (jsonUrl && baseUrl) {
    try {
      const response = await fetch(jsonUrl, {
        next: { revalidate: 60 },
      })

      if (response.ok) {
        const catalog = (await response.json()) as ProjectCatalog
        if (Array.isArray(catalog.projects) && catalog.projects.length > 0) {
          const projects = resolveProjects(catalog.projects, baseUrl)

          if (process.env.PROJECTS_MEDIA_ON_R2 === "true") {
            return projects
          }

          return projects.map((project) => {
            const fallback = fallbackProjects.find((item) => item.id === project.id)
            if (!fallback) return project

            return {
              ...project,
              image: fallback.image,
              before: fallback.before,
              after: fallback.after,
            }
          })
        }
      }
    } catch {
      // Fall back to placeholders when R2 is unreachable.
    }
  }

  return fallbackProjects
}
