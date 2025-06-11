(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner(0);


    // Fixed Navbar
    $(window).scroll(function () {
        if ($(window).width() < 992) {
            if ($(this).scrollTop() > 55) {
                $('.fixed-top').addClass('shadow');
            } else {
                $('.fixed-top').removeClass('shadow');
            }
        } else {
            if ($(this).scrollTop() > 55) {
                $('.fixed-top').addClass('shadow').css('top', 0);
            } else {
                $('.fixed-top').removeClass('shadow').css('top', 0);
            }
        }
    });


    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Testimonial carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 2000,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav: true,
        navText: [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0: {
                items: 1
            },
            576: {
                items: 1
            },
            768: {
                items: 1
            },
            992: {
                items: 2
            },
            1200: {
                items: 2
            }
        }
    });


    // vegetable carousel
    $(".vegetable-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav: true,
        navText: [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0: {
                items: 1
            },
            576: {
                items: 1
            },
            768: {
                items: 2
            },
            992: {
                items: 3
            },
            1200: {
                items: 4
            }
        }
    });


    // Modal Video
    $(document).ready(function () {
        var $videoSrc;
        $('.btn-play').click(function () {
            $videoSrc = $(this).data("src");
        });
        console.log($videoSrc);

        $('#videoModal').on('shown.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
        })

        $('#videoModal').on('hide.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc);
        })

        //add active class to header
        const navElement = $('#navbarCollapse');
        const currentUrl = window.location.pathname;
        navElement.find('a.nav-link').each(function () {
            const link = $(this);
            const href = link.attr('href');

            if (href == currentUrl) {
                link.addClass('active');
            } else {
                link.removeClass('active');
            }
        });
    });


    // Product Quantity
    // $('.quantity button').on('click', function () {
    //     var button = $(this);
    //     var oldValue = button.parent().parent().find('input').val();
    //     if (button.hasClass('btn-plus')) {
    //         var newVal = parseFloat(oldValue) + 1;
    //     } else {
    //         if (oldValue > 0) {
    //             var newVal = parseFloat(oldValue) - 1;
    //         } else {
    //             newVal = 0;
    //         }
    //     }
    //     button.parent().parent().find('input').val(newVal);
    // });

    $('.quantity button').on('click', function () {
        let change = 0;

        var button = $(this);
        var oldValue = button.parent().parent().find('input').val();
        if (button.hasClass('btn-plus')) {
            var newVal = parseFloat(oldValue) + 1;
            change = 1;
        } else {
            if (oldValue > 1) {
                var newVal = parseFloat(oldValue) - 1;
                change = -1;
            } else {
                newVal = 1;
            }
        }
        const input = button.parent().parent().find('input');
        input.val(newVal);

        // set from index
        const index = input.attr("data-cart-detail-index")
        const el = document.getElementById(`cartDetails${index}.quantity`);
        $(el).val(newVal);

        // get price
        const price = input.attr("data-cart-detail-price");
        const id = input.attr("data-cart-detail-id");

        const priceElement = $(`p[data-cart-detail-id='${id}']`);
        if (priceElement) {
            const newPrice = +price * newVal;
            priceElement.text(formatCurrency(newPrice.toFixed(2)) + " đ");
        }

        // update total cart price
        const totalPriceElement = $(`p[data-cart-total-price]`);

        if (totalPriceElement && totalPriceElement.length) {
            const currentTotal = totalPriceElement.first().attr("data-cart-total-price");
            let newTotal = +currentTotal;
            if (change === 0) {
                newTotal = +currentTotal;
            } else {
                newTotal = change * (+price) + (+currentTotal);
            }

            // reset change
            change = 0;

            // update
            totalPriceElement?.each(function (index, element) {
                // update text
                $(totalPriceElement[index]).text(formatCurrency(newTotal.toFixed(2)) + " đ");

                //update data-attribute
                $(totalPriceElement[index]).attr("data-cart-total-price", newTotal);
            });
        }
    });

    function formatCurrency(value) {
        const formatter = new Intl.NumberFormat('vi-VN', {
            style: 'decimal',
            minimumFractionDigits: 0,
        });

        let formatted = formatter.format(value);
        formatted = formatted.replace(/\./g, ',');
        return formatted;
    }

    // handle filter products
    $('#btnFilter').click(function (event) {
        event.preventDefault();

        let factoryArr = [];
        let targetArr = [];
        let priceArr = [];
        //factory filter
        $("#factoryFilter .form-check-input:checked").each(function () {
            factoryArr.push($(this).val());
        });

        //target filter
        $("#targetFilter .form-check-input:checked").each(function () {
            targetArr.push($(this).val());
        });

        //price filter
        $("#priceFilter .form-check-input:checked").each(function () {
            priceArr.push($(this).val());
        });

        //sort order
        let sortValue = $('input[name="radio-sort"]:checked').val();

        const currentUrl = new URL(window.location.href);
        const searchParams = currentUrl.searchParams;

        // Add or update query parameters
        searchParams.set('page', '1');
        searchParams.set('sort', sortValue);

        searchParams.delete('target')
        searchParams.delete('factory')
        searchParams.delete('price')


        if (factoryArr.length > 0) {
            searchParams.set('factory', factoryArr.join(','));
        }
        if (targetArr.length > 0) {
            searchParams.set('target', targetArr.join(','));
        }
        if (priceArr.length > 0) {
            searchParams.set('price', priceArr.join(','));
        }

        // Update the URL and reload the page
        window.location.href = currentUrl.toString();
    });

    //handle auto checkbox after page loading
    // Parse the URL parameters
    const params = new URLSearchParams(window.location.search);

    // Set checkboxes for 'factory'
    if (params.has('factory')) {
        const factories = params.get('factory').split(',');
        factories.forEach(factory => {
            $(`#factoryFilter .form-check-input[value="${factory}"]`).prop('checked', true);
        });
    }

    // Set checkboxes for 'target'
    if (params.has('target')) {
        const targets = params.get('target').split(',');
        targets.forEach(target => {
            $(`#targetFilter .form-check-input[value="${target}"]`).prop('checked', true);
        });
    }

    // Set checkboxes for 'price'
    if (params.has('price')) {
        const prices = params.get('price').split(',');
        prices.forEach(price => {
            $(`#priceFilter .form-check-input[value="${price}"]`).prop('checked', true);
        });
    }

    // Set radio buttons for 'sort'
    if (params.has('sort')) {
        const sort = params.get('sort');
        $(`input[type="radio"][name="radio-sort"][value="${sort}"]`).prop('checked', true);
    }
    //////////////////////////
    //handle add to cart with ajax
    // $('.btnAddToCartHomepage').click(function (event) {
    //     event.preventDefault();
    //
    //     if (!isLogin()) {
    //         $.toast({
    //             heading: 'Lỗi thao tác',
    //             text: 'Bạn cần đăng nhập tài khoản',
    //             position: 'top-right',
    //             icon: 'error'
    //         })
    //         return;
    //     }
    //
    //     const productId = $(this).attr('data-product-id');
    //     const token = $("meta[name='_csrf']").attr("content");
    //     const header = $("meta[name='_csrf_header']").attr("content");
    //
    //     $.ajax({
    //         url: `${window.location.origin}/api/add-product-to-cart`,
    //         beforeSend: function (xhr) {
    //             xhr.setRequestHeader(header, token);
    //         },
    //         type: "POST",
    //         data: JSON.stringify({ quantity: 1, productId: productId }),
    //         contentType: "application/json",
    //
    //         success: function (response) {
    //             const sum = +response;
    //             //update cart
    //             $("#sumCart").text(sum)
    //             //show message
    //             $.toast({
    //                 heading: 'Giỏ hàng',
    //                 text: 'Thêm sản phẩm vào giỏ hàng thành công',
    //                 position: 'top-right',
    //
    //             })
    //
    //         },
    //         error: function (response) {
    //             alert("có lỗi xảy ra, check code đi ba :v")
    //             console.log("error: ", response);
    //         }
    //
    //     });
    // });

    // $('.btnAddToCartDetail').click(function (event) {
    //     event.preventDefault();
    //     if (!isLogin()) {
    //         $.toast({
    //             heading: 'Lỗi thao tác',
    //             text: 'Bạn cần đăng nhập tài khoản',
    //             position: 'top-right',
    //             icon: 'error'
    //         })
    //         return;
    //     }
    //
    //     const productId = $(this).attr('data-product-id');
    //     const token = $("meta[name='_csrf']").attr("content");
    //     const header = $("meta[name='_csrf_header']").attr("content");
    //     const quantity = $("#cartDetails0\\.quantity").val();
    //     $.ajax({
    //         url: `${window.location.origin}/api/add-product-to-cart`,
    //         beforeSend: function (xhr) {
    //             xhr.setRequestHeader(header, token);
    //         },
    //         type: "POST",
    //         data: JSON.stringify({ quantity: quantity, productId: productId }),
    //         contentType: "application/json",
    //
    //         success: function (response) {
    //             const sum = +response;
    //             //update cart
    //             $("#sumCart").text(sum)
    //             //show message
    //             $.toast({
    //                 heading: 'Giỏ hàng',
    //                 text: 'Thêm sản phẩm vào giỏ hàng thành công',
    //                 position: 'top-right',
    //
    //             })
    //
    //         },
    //         error: function (response) {
    //             alert("có lỗi xảy ra, check code đi ba :v")
    //             console.log("error: ", response);
    //         }
    //
    //     });
    // });

    // function isLogin(){
    //     const navElement = $("#navbarCollapse");
    //     const childLogin = navElement.find('a.a-login');
    //     if(childLogin.length > 0){
    //         return false;
    //     }
    //     return true;
    // }

    document.getElementById("btnCheckout").addEventListener("click", function () {
        const checkedBoxes = document.querySelectorAll('.cart-checkbox:checked');
        const selectedIds = [];

        checkedBoxes.forEach(function (checkbox) {
            selectedIds.push(checkbox.value);
        });

        if (selectedIds.length === 0) {
            alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán.");
            return;
        }

        // Tạo URL với danh sách ID
        const url = new URL(window.location.origin + "/confirm-checkout");
        selectedIds.forEach(id => {
            url.searchParams.append("cartItemIds", id);
        });

        window.location.href = url.toString();
    });

    // $(document).ready(function () {
    //     $('#submitOrderBtn').click(function (e) {
    //         e.preventDefault(); // chặn form submit mặc định
    //
    //         // Lấy danh sách ID sản phẩm
    //         let cartItemIds = [];
    //         $('.cart-item-id').each(function () {
    //             cartItemIds.push($(this).val());
    //         });
    //
    //         // Lấy thông tin người nhận
    //         const receiverName = $('input[name="receiverName"]').val();
    //         const receiverAddress = $('input[name="receiverAddress"]').val();
    //         const receiverPhone = $('input[name="receiverPhone"]').val();
    //         const csrfToken = $('input[name="_csrf"]').val();
    //
    //
    //         const url = new URL(window.location.origin + "/place-order");
    //         cartItemIds.forEach(id => {
    //             url.searchParams.append("cartItemIds", id);
    //         });
    //
    //         window.location.href = url.toString();
    //
    //         // window.location.href = '/order-success';
    //
    //         // Gửi AJAX
    //         // $.ajax({
    //         //     url: '/place-order',
    //         //     type: 'POST',
    //         //     contentType: 'application/json',
    //         //     headers: {
    //         //         'X-CSRF-TOKEN': csrfToken
    //         //     },
    //         //     data: JSON.stringify({
    //         //         cartItemIds: cartItemIds,
    //         //         receiverName: receiverName,
    //         //         receiverAddress: receiverAddress,
    //         //         receiverPhone: receiverPhone
    //         //     }),
    //         //     success: function (response) {
    //         //         // Chuyển hướng hoặc hiển thị thông báo
    //         //         window.location.href = '/order-success';
    //         //     },
    //             // error: function (xhr) {
    //             //     alert('Lỗi khi đặt hàng: ' + xhr.responseText);
    //             // }
    //         // });
    //     });
    // });


})(jQuery);

