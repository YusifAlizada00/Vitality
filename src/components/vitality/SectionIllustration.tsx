"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

import { SECTION_PHOTOS } from "@/lib/sectionPhotos";
import type { VitalityLedger, VitalityInputs } from "@/lib/vitalityMath";
import type { VitalityCategory } from "./CategoryPicker";

type Props = {
  category: VitalityCategory;
  inputs: VitalityInputs;
  ledger: VitalityLedger;
};

function resolvePhoto(
  category: VitalityCategory,
  inputs: VitalityInputs,
  ledger: VitalityLedger,
): { src: string; alt: string; smog: boolean } {
  switch (category) {
    case "commute": {
      if (inputs.mode === "walk") {
        return {
          src: SECTION_PHOTOS.commuteWalk,
          alt: "Real photograph: walking outdoors on a path",
          smog: false,
        };
      }
      if (inputs.mode === "bus") {
        const smog = ledger.commuteProducedG > 0 && inputs.distanceKm > 0;
        return {
          src: SECTION_PHOTOS.commuteBus,
          alt: "Real photograph: public transport and city streets",
          smog,
        };
      }
      const smog = ledger.commuteProducedG > 0 && inputs.distanceKm > 0;
      return {
        src: SECTION_PHOTOS.commuteCar,
        alt: "Real photograph: cars and urban traffic",
        smog,
      };
    }
    case "hydration":
      return inputs.bottles > 0
        ? {
            src: SECTION_PHOTOS.hydrationPlastic,
            alt: "Real photograph: plastic bottles and recycling context",
            smog: true,
          }
        : {
            src: SECTION_PHOTOS.hydrationClean,
            alt: "Real photograph: drinking water",
            smog: false,
          };
    case "travel":
      return {
        src: SECTION_PHOTOS.travelFlight,
        alt: "Real photograph: aviation and sky travel",
        smog: inputs.flightKm > 0,
      };
    case "home":
      return {
        src: SECTION_PHOTOS.home,
        alt: "Real photograph: residential home exterior",
        smog: ledger.homeProducedG > 0 && inputs.homeKwh > 0,
      };
    case "food":
      return inputs.meatMeals > 0
        ? {
            src: SECTION_PHOTOS.foodMeat,
            alt: "Real photograph: cooked meal on a plate",
            smog: true,
          }
        : {
            src: SECTION_PHOTOS.foodPlant,
            alt: "Real photograph: fresh meal in a bowl",
            smog: false,
          };
    case "digital":
    default:
      return inputs.streamingHours > 0
        ? {
            src: SECTION_PHOTOS.digitalStream,
            alt: "Real photograph: laptop on a desk",
            smog: true,
          }
        : {
            src: SECTION_PHOTOS.digitalIdle,
            alt: "Real photograph: flowers and natural light",
            smog: false,
          };
  }
}

export function SectionIllustration({ category, inputs, ledger }: Props) {
  const { src, alt, smog } = resolvePhoto(category, inputs, ledger);

  return (
    <motion.div
      layout
      className="relative w-full max-w-[280px] overflow-hidden rounded-3xl border border-white/90 bg-slate-100 shadow-card sm:max-w-none"
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 28 }}
    >
      <div className="relative aspect-[4/3] w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={src}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0"
          >
            <Image
              src={src}
              alt={alt}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 280px, 33vw"
              priority={false}
            />
          </motion.div>
        </AnimatePresence>

        {smog ? (
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-orange-950/45 via-amber-900/15 to-stone-900/25 mix-blend-multiply"
            aria-hidden
          />
        ) : null}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/10" />
      </div>

      <div className="relative border-t border-white/60 bg-white/95 px-3 py-2.5">
        <div className="min-h-[2.5rem] text-center">
          {category === "hydration" ? (
            <p className="text-[10px] font-semibold tabular-nums text-sky-vitality">
              {inputs.bottles} bottle{inputs.bottles === 1 ? "" : "s"}
              {inputs.bottles > 0 ? " · real plastic photo" : " · low-waste hydration"}
            </p>
          ) : category === "commute" ? (
            <p className="text-[10px] font-semibold text-slate-700">
              {inputs.distanceKm <= 0
                ? "Add km — photo updates with walk / bus / car."
                : inputs.mode === "walk"
                  ? "Walking — clean-air photo."
                  : inputs.mode === "bus"
                    ? "Bus / transit — smog tint when trip emits CO₂."
                    : "Traffic / car — stronger smog tint when trip emits CO₂."}
            </p>
          ) : category === "travel" && inputs.flightKm > 0 ? (
            <p className="text-[10px] font-semibold text-sunset-vitality">Flight logged — cabin-window photo + tint</p>
          ) : (
            <p className="text-[10px] text-slate-500">Real JPEG in your app bundle</p>
          )}
        </div>
        <a
          href="https://picsum.photos"
          target="_blank"
          rel="noreferrer"
          className="mt-1 block text-center text-[9px] text-slate-400 underline decoration-slate-300 underline-offset-2 hover:text-slate-600"
        >
          Source: Lorem Picsum (stock photos)
        </a>
      </div>
    </motion.div>
  );
}
