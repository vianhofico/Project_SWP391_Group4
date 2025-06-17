// components/Home.jsx
import React from "react";
import { Header } from "./header";
import { Features } from "./features";
import { About } from "./about";
import { Testimonials } from "./testimonials";
import { Course } from "./Course";
import { Contact } from "./contact";

const Home = ({ landingPageData }) => {
    return (
        <>
            <Header data={landingPageData.Header} />
            <Course data={landingPageData.Course} />
            <Features data={landingPageData.Features} />
            <About data={landingPageData.About} />
            <Testimonials data={landingPageData.Testimonials} />
            <Contact data={landingPageData.Contact} />
        </>
    );
};

export default Home;
