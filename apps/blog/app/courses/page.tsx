import ListCourses from "./ListCourses";
import SimpleLayout from "components/SimpleLayout";
import CoursesPlaceholder from "components/skeleton/CoursesPlaceholder";
import { server } from "config";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Courses",
  description:
    "During my time at IUB, I've worked as a teaching assistant and research assistant for a few different courses. These are the courses I've instructed.",
  openGraph: {
    title: "Courses - 研之有物",
    description:
      "During my time at IUB, I've worked as a teaching assistant and research assistant for a few different courses. These are the courses I've instructed.",
    url: `${server}/courses`,
    type: "website",
    site_name: "研之有物 - Innovative Researcher and Skilled Mentor",
    images: [
      {
        url: `${server}/images/og-image.png`,
        alt: "研之有物",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@mir_sazzat",
    creator: "@mir_sazzat",
    title: "Courses - 研之有物",
    description:
      "During my time at IUB, I've worked as a teaching assistant and research assistant for a few different courses. These are the courses I've instructed.",
    images: [
      {
        url: `${server}/images/og-image.png`,
        alt: "研之有物",
        width: 1200,
        height: 630,
      },
    ],
  },
  alternates: {
    canonical: `${server}/courses`,
    types: {
      "application/rss+xml": `${server}/feed.xml`,
    },
  },
};

export default function Courses(): JSX.Element {
  return (
    <SimpleLayout
      title="Courses that I've instructed as a RA or TA at IUB"
      intro="During my time at IUB, I've worked as a teaching assistant and research assistant for a few different courses. These are the courses I've instructed."
    >
      <div className="mt-16 sm:mt-20">
        <Suspense fallback={<CoursesPlaceholder />}>
          {/* @ts-expect-error Server Component */}
          <ListCourses />
        </Suspense>
      </div>
    </SimpleLayout>
  );
}
