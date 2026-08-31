import { Opening } from "@/components/opening"
import { About } from "@/components/about"
import { Exhibition } from "@/components/exhibition"
import { Contact } from "@/components/contact"
import { HashScroll } from "@/components/hash-scroll"

export default function Home() {
  return (
    <>
      <HashScroll />
      <main>
        <Opening />
        <About />
        <Exhibition />
        <Contact />
      </main>
    </>
  )
}
