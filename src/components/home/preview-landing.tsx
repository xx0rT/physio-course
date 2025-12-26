import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export default function PreviewLanding() {
  return (
    <div className="pb-6 sm:pb-16 transition-all duration-700 ease-in-out">
      <MaxWidthWrapper>
        <div className="rounded-xl md:bg-muted/30 md:p-3.5 md:ring-1 md:ring-inset md:ring-border">
          <div className="relative aspect-video overflow-hidden rounded-xl border md:rounded-lg group">
            <img
              className="size-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              src="/home/skill background.png"
              alt="Fyzioterapeutická péče - online kurzy a konzultace"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end p-8">
              <div className="text-white">
                <h3 className="text-2xl md:text-4xl font-bold mb-2">
                  Moderní fyzioterapie online
                </h3>
                <p className="text-sm md:text-lg text-gray-200">
                  Profesionální péče dostupná odkudkoliv, kdykoliv
                </p>
              </div>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
