import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import React from "react";
import { Link } from "react-router-dom";
import companies from "../data/companies.json";
import faqs from "../data/faq.json";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const LandingPage = () => {
  return (
    <>
      <main className="flex flex-col gap-10 sm:gap-20 py-10 sm:py-20">
        <section className="text-center">
          <h1 className="capitalize flex flex-col items-center justify-center gradient-title text-4xl font-extrabold sm:text-6xl lg:text-8xl tracking-tighter py-4">
            Find Your Dream Internship{" "}
            <span className="flex items-center gap-2 sm:gap-6">
              & get{" "}
              <img
                src="https://res.cloudinary.com/dlf6jkg3d/image/upload/v1725423233/logo_tbrjh5.png"
                alt="Hired"
                className="h-14 sm:h-24 lg:h-32"
              />
            </span>
          </h1>
          <p className="text-gray-300 sm:mt-4 text-xs sm:text-xl capitalize">
            Explore millions of internships or find the eligible one as per your
            job role & requirements
          </p>
        </section>
        <div className="flex gap-6 justify-center">
          <Link to="/jobs">
            <Button variant="blue" size="xl">
              Find Internships
            </Button>
          </Link>
          <Link to="/post-job">
            <Button variant="destructive" size="xl">
              Post Internships
            </Button>
          </Link>
        </div>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 2000,
            }),
          ]}
          className="w-full py-10"
        >
          <CarouselContent className="flex gap-5 sm:gap-20 items-center">
            {companies.map(({ name, id, path }) => (
              <CarouselItem key={id} className="basis-1/3 lg:basis-1/4 ">
                <img
                  src={path}
                  alt={name}
                  className="h-9 sm:h-14 object-contain"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-bold">
                For Internship Seekers
              </CardTitle>
            </CardHeader>
            <CardContent>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eum
              sequi illum sunt maiores excepturi ducimus? Reiciendis quisquam
              reprehenderit error, unde provident repellendus officiis iusto
              incidunt.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-bold">For Employers</CardTitle>
            </CardHeader>
            <CardContent>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolores
              saepe id quaerat optio beatae quos explicabo. Cupiditate officiis
              similique totam, quo molestias sint magni doloremque.
            </CardContent>
          </Card>
        </section>
        <Accordion type="multiple" className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index + 1}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </main>
    </>
  );
};

export default LandingPage;
