import { motion } from "framer-motion";
import { CheckCircle2, Clock, Users, Award, TrendingUp, BookOpen, Target, Zap } from "lucide-react";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const CourseShowcaseSection = () => {
  const roadmapSteps = [
    {
      phase: "Fáze 1",
      title: "Základy",
      duration: "1-2 týdny",
      topics: ["Úvod do fyzioterapie", "Anatomie a fyziologie", "Základní techniky"],
      icon: BookOpen,
      color: "from-teal-500 to-teal-600"
    },
    {
      phase: "Fáze 2",
      title: "Pokročilé techniky",
      duration: "3-4 týdny",
      topics: ["Manuální terapie", "Terapeutické cvičení", "Speciální metody"],
      icon: Target,
      color: "from-blue-500 to-blue-600"
    },
    {
      phase: "Fáze 3",
      title: "Klinická praxe",
      duration: "5-6 týdnů",
      topics: ["Případové studie", "Reálné pacienty", "Praktické aplikace"],
      icon: Users,
      color: "from-rose-500 to-rose-600"
    },
    {
      phase: "Fáze 4",
      title: "Certifikace",
      duration: "1 týden",
      topics: ["Závěrečný test", "Praktická zkouška", "Certifikát"],
      icon: Award,
      color: "from-amber-500 to-amber-600"
    }
  ];

  const features = [
    {
      icon: Clock,
      title: "Flexibilní tempo",
      description: "Učte se vlastním tempem, kdykoli a kdekoli"
    },
    {
      icon: Users,
      title: "Expert lektoři",
      description: "Učte se od certifikovaných profesionálů"
    },
    {
      icon: Award,
      title: "Oficiální certifikát",
      description: "Získejte uznávaný certifikát po dokončení"
    },
    {
      icon: TrendingUp,
      title: "Kariérní růst",
      description: "Zvyšte své profesní kompetence"
    }
  ];

  const sampleLessons = [
    {
      title: "Úvod do manuální terapie",
      duration: "45 min",
      type: "Video lekce",
      thumbnail: "/home/course1.png",
      free: true
    },
    {
      title: "Anatomie pohybového systému",
      duration: "60 min",
      type: "Interaktivní modul",
      thumbnail: "/home/course2.png",
      free: true
    },
    {
      title: "Praktické cvičení - Záda",
      duration: "30 min",
      type: "Praktická ukázka",
      thumbnail: "/home/course3.png",
      free: false
    }
  ];

  return (
    <MaxWidthWrapper className="py-20">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-sm font-semibold mb-4">
            <Zap className="w-4 h-4" />
            <span>Váš profesní růst začína zde</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white mb-6">
            Objevte naši cestu <br />
            <span className="bg-gradient-to-r from-teal-500 to-rose-400 bg-clip-text text-transparent">
              k úspěchu ve fyzioterapii
            </span>
          </h2>
          <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
            Strukturovaný program navržený profesionály pro profesionály. Od základů po pokročilé techniky - vše na jednom místě.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
      >
        {features.map((feature, index) => (
          <Card key={index} className="border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
            Váš studijní plán
          </h3>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Postupujte krok za krokem k expertním dovednostem
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-blue-500 via-rose-500 to-amber-500 -translate-y-1/2 opacity-20" />

          {roadmapSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Card className="border-neutral-200 dark:border-neutral-800 hover:shadow-xl transition-all hover:-translate-y-2">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 mx-auto`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-teal-600 dark:text-teal-400 mb-1">
                      {step.phase}
                    </div>
                    <h4 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                      {step.title}
                    </h4>
                    <div className="flex items-center justify-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                      <Clock className="w-4 h-4" />
                      <span>{step.duration}</span>
                    </div>
                    <ul className="space-y-2 text-left">
                      {step.topics.map((topic, topicIndex) => (
                        <li key={topicIndex} className="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                          <CheckCircle2 className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
            Ukázka kurzů
          </h3>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Prohlédněte si vzorové lekce a zjistěte, co vás čeká
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sampleLessons.map((lesson, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden border-neutral-200 dark:border-neutral-800 hover:shadow-xl transition-all group">
                <div className="relative overflow-hidden aspect-video">
                  <img
                    src={lesson.thumbnail}
                    alt={lesson.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {lesson.free && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-teal-500 text-white text-xs font-bold rounded-full">
                      ZDARMA
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 text-white text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{lesson.duration}</span>
                      <span className="mx-2">•</span>
                      <span>{lesson.type}</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h4 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                    {lesson.title}
                  </h4>
                  {lesson.free && (
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/courses">Vyzkoušet zdarma</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <Card className="border-2 border-teal-500 dark:border-teal-600 bg-gradient-to-br from-teal-50 to-rose-50 dark:from-teal-950/30 dark:to-rose-950/30 p-8 md:p-12">
          <CardContent>
            <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-4">
              Jste připraveni začít svou cestu?
            </h3>
            <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-8 max-w-2xl mx-auto">
              Připojte se k tisícům studentů, kteří již transformovali svou kariéru s našimi certifikovanými kurzy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white" asChild>
                <Link to="/courses">Prohlédnout všechny kurzy</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/auth/register">Začít zdarma</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </MaxWidthWrapper>
  );
};

export default CourseShowcaseSection;
