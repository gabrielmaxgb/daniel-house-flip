import { Opening } from "@/components/opening"
import { About } from "@/components/about"
import { Exhibition } from "@/components/exhibition"
import { Contact } from "@/components/contact"
import { HashScroll } from "@/components/hash-scroll"
import { getProjects } from "@/lib/projects"

export default async function Home() {
  const projects = await getProjects()

  return (
    <>
      <HashScroll />
      <main>
        <Opening />
        <About />
        <Exhibition projects={projects} />
        <Contact />
      </main>
    </>
  )
}
