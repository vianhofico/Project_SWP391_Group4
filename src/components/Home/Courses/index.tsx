"use client";

import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import axios from "axios";
import Swal from "sweetalert2";


const Courses = () => {
    const [courseList, setCourseList] = useState([]);
    const [loadingId, setLoadingId] = useState(0);

    useEffect(() => {
        fetchAllCourse();
    }, []);

    const fetchAllCourse = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/home");
            setCourseList(response.data || []);
        } catch (error) {
            console.error("Failed to fetch courses:", error);
            setCourseList([]);
        }
    };

    const handleAddToCart = async (id: number) => {
        setLoadingId(id);
        try {
            await axios.post(`http://localhost:8080/api/add-course-to-cart/${id}`);
            window.dispatchEvent(new Event("cartUpdated"));

        } catch (error) {
            console.error("cannot add course to cart");
        } finally {
            setTimeout(() => {
                setLoadingId(0);
            }, 500);
        }
    };

    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const halfStars = rating % 1 >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStars;

        return (
            <>
                {Array(fullStars).fill(
                    <Icon icon="tabler:star-filled" className="text-yellow-500 text-xl inline-block" />
                )}
                {halfStars > 0 && (
                    <Icon icon="tabler:star-half-filled" className="text-yellow-500 text-xl inline-block" />
                )}
                {Array(emptyStars).fill(
                    <Icon icon="tabler:star-filled" className="text-gray-400 text-xl inline-block" />
                )}
            </>
        );
    };

    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 2,
        arrows: false,
        autoplay: true,
        speed: 500,
        cssEase: "linear",
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false,
                },
            },
        ],
    };

    return (
        <section id="courses">
            <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4">
                <div className="sm:flex justify-between items-center mb-20">
                    <h2 className="text-midnight_text text-4xl lg:text-5xl font-semibold mb-5 sm:mb-0">
                        Khóa học nổi bật
                    </h2>
                    <Link
                        href="/"
                        className="text-primary text-lg font-medium hover:tracking-widest duration-500"
                    >
                        Tất cả khóa học &nbsp;&gt;&nbsp;
                    </Link>
                </div>
                <Slider {...settings}>
                    {courseList.map((items: any, i: number) => (
                        <div key={i}>
                            <div className="bg-white m-3 mb-12 px-3 pt-3 pb-12 shadow-course-shadow rounded-2xl h-full">
                                <div className="relative rounded-3xl">
                                    <Image
                                        src={`http://localhost:8080/images/product/${items.image}`}
                                        alt="course-image"
                                        width={389}
                                        height={262}
                                        className="m-auto clipPath"
                                    />
                                    <div className="absolute right-5 -bottom-2 bg-secondary rounded-full p-6">
                                        <h3 className="text-white uppercase text-center text-sm font-medium">
                                            best <br /> seller
                                        </h3>
                                    </div>
                                </div>

                                <div className="px-3 pt-6">
                                    <Link
                                        href="#"
                                        className="text-2xl font-bold text-black max-w-75% inline-block"
                                    >
                                        {items.title}
                                    </Link>
                                    <h3 className="text-base font-normal pt-6 text-black/75">
                                        {items.author || "N/A"}
                                    </h3>
                                    <div className="flex justify-between items-center py-6 border-b">
                                        <div className="flex items-center gap-4">
                                            <h3 className="text-red-700 text-2xl font-medium">
                                                {items.rating || 4.5}
                                            </h3>
                                            <div className="flex">{renderStars(items.rating || 4.5)}</div>
                                        </div>
                                        <h3 className="text-3xl font-medium">
                                            {items.price?.toLocaleString()} đ
                                        </h3>
                                    </div>
                                    <div className="flex justify-between pt-6 items-center">
                                        <div className="flex gap-2 items-center">
                                            <Icon
                                                icon="solar:notebook-minimalistic-outline"
                                                className="text-primary text-xl"
                                            />
                                            <span className="text-base font-medium text-black opacity-75">
                                                {items.classes || 10} classes
                                            </span>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <Icon
                                                icon="solar:users-group-rounded-linear"
                                                className="text-primary text-xl"
                                            />
                                            <span className="text-base font-medium text-black opacity-75">
                                                {items.students || 100} students
                                            </span>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            className="btn btn-secondary w-full mt-3"
                                            onClick={() => handleAddToCart(items.courseId)}
                                            disabled={loadingId === items.courseId}
                                            style={{
                                                opacity: loadingId === items.courseId ? 0.6 : 1,
                                                pointerEvents: loadingId === items.courseId ? "none" : "auto",
                                                transition: "all 0.2s ease",
                                            }}
                                        >
                                            {loadingId === items.courseId ? (
                                                <span>
                                                    <i className="bi bi-arrow-repeat spin"></i> Đang thêm...
                                                </span>
                                            ) : (
                                                <span>
                                                    <i className="bi bi-cart"></i> Thêm vào giỏ hàng
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </section>
    );
};

export default Courses;
