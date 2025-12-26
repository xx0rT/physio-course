import { HeaderSection } from "@/components/shared/header-section";

const testimonials = [
  {
    name: "Jana Nováková",
    job: "Sportovní trenérka",
    image: "/home/person1.png",
    review: "Po zranění kolene jsem potřebovala odbornou péči. Díky individuálnímu přístupu fyzioterapeutů jsem se vrátila ke sportu rychleji, než jsem očekávala."
  },
  {
    name: "Petr Dvořák",
    job: "IT specialista",
    image: "/home/person2.png",
    review: "Trpěl jsem chronickými bolestmi zad kvůli sedavému zaměstnání. Online kurzy ergonomie a pravidelná cvičení mi úplně změnila kvalitu života. Doporučuji všem v kancelářské práci! Přístup fyzioterapeutů je profesionální a vždy se přizpůsobí mým potřebám. Po třech měsících jsem bez bolesti."
  },
  {
    name: "Marie Svobodová",
    job: "Důchodkyně",
    image: "/home/person3.png",
    review: "Ve svém věku jsem měla obavy z cvičení, ale fyzioterapeuti mě skvěle vedli. Postupné posílení svalů a zlepšení pohyblivosti mi vrátilo samostatnost."
  },
  {
    name: "Tomáš Procházka",
    job: "Manažer",
    image: "/home/person4.png",
    review: "Po operaci ramene byla rehabilitace klíčová. Online konzultace mi umožnily cvičit z domova podle vlastního harmonogramu."
  },
  {
    name: "Lucie Kratochvílová",
    job: "Učitelka",
    image: "/home/person5.png",
    review: "Migrény a napětí v krční páteři mě trápily roky. Komplexní přístup zahrnující masáže, protahovací cvičení a edukaci o správném držení těla mi konečně přinesl úlevu. Teď můžu zase normálně pracovat a užívat si života bez neustálých bolestí hlavy."
  },
  {
    name: "Jan Marek",
    job: "Stavební dělník",
    image: "/home/person6.png",
    review: "Pracovní úraz mi způsobil vážné problémy s páteří. Díky strukturovanému rehabilitačnímu programu jsem se mohl vrátit k práci. Profesionální péče na vysoké úrovni."
  }
];

export default function Testimonials() {
  return (
    <section className="transition-all duration-700 ease-in-out">
      <div className="container mx-auto flex max-w-6xl flex-col gap-10 py-32 sm:gap-y-16 px-4">
        <HeaderSection
          label="Reference pacientů"
          title="Co říkají naši klienti"
          subtitle="Poznejte skutečné příběhy lidí, kterým jsme pomohli vrátit se k aktivnímu životu bez bolesti"
        />

        <div className="column-1 gap-5 space-y-5 md:columns-2 lg:columns-3 ">
          {testimonials.map((item) => (
            <div className="break-inside-avoid" key={item.name}>
              <div className="relative rounded-xl border bg-muted/25 hover:bg-muted/40 transition-all duration-300">
                <div className="flex flex-col px-4 py-5 sm:p-6">
                  <div>
                    <div className="relative mb-4 flex items-center gap-3">
                      <span className="relative inline-flex size-10 shrink-0 items-center justify-center rounded-full text-base">
                        <img
                          className="size-full rounded-full border object-cover"
                          src={item.image}
                          alt={item.name}
                        />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {item.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.job}
                        </p>
                      </div>
                    </div>
                    <q className="text-muted-foreground">{item.review}</q>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
