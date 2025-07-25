import React, {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import Swal from 'sweetalert2';
import Footer from "@/components/footer";

const CartDetail = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [selectedItems, setSelectedItems] = useState([]);
    const [discountMap, setDiscountMap] = useState({});
    const [totalDiscount, setTotalDiscount] = useState(0);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    // Format date to dd/mm/yyyy
    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        fetchCart();
    }, []);

    useEffect(() => {
        let total = 0;
        let discountAmount = 0;

        cartItems.forEach((item) => {
            if (selectedItems.includes(item.cartItemId)) {
                const course = item.course;
                const discount = discountMap[course.courseId];
                const original = course.price;
                const final = calculateDiscountedPrice(original, discount);
                total += final;
                discountAmount += original - final;
            }
        });

        setTotalPrice(total);
        setTotalDiscount(discountAmount);
    }, [cartItems, selectedItems, discountMap]);

    const fetchCart = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/api/cart`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const items = response.data;
            setCartItems(Array.isArray(items) ? items : []);
            setSelectedItems(items.map(item => item.cartItemId));
            localStorage.setItem("cartItems", JSON.stringify(items));
            window.dispatchEvent(new Event("cartUpdated"));

            const discountResponses = await Promise.all(
                items.map(item =>
                    axios
                        .get(`http://localhost:8080/api/client/discounts/course/${item.course.courseId}`, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        })
                        .then(res => ({courseId: item.course.courseId, discount: res.data}))
                        .catch(() => ({courseId: item.course.courseId, discount: null}))
                )
            );

            const map = {};
            discountResponses.forEach(item => {
                if (item.discount?.discounted) {
                    map[item.courseId] = item.discount;
                }
            });
            setDiscountMap(map);
        } catch (error) {
            console.error("Error fetching cart:", error);
            setCartItems([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/delete-cart-course/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            await fetchCart();
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    const handleDeleteAll = async () => {
        const confirm = await Swal.fire({
            icon: 'warning',
            title: 'Clear Cart',
            text: 'Are you sure you want to remove all items from your cart?',
            showCancelButton: true,
            confirmButtonText: 'Clear All',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#dc3545'
        });

        if (confirm.isConfirmed) {
            try {
                await Promise.all(
                    cartItems.map(item =>
                        axios.delete(`http://localhost:8080/api/delete-cart-course/${item.cartItemId}`, {
                            headers: {Authorization: `Bearer ${token}`}
                        })
                    )
                );
                await fetchCart();
                Swal.fire({
                    icon: 'success',
                    title: 'Cart Cleared',
                    text: 'All items have been removed from your cart.',
                    timer: 2000,
                    showConfirmButton: false
                });
            } catch (error) {
                console.error("Error clearing cart:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to clear cart. Please try again.'
                });
            }
        }
    };

    const handleCheckboxChange = (e, id) => {
        if (e.target.checked) {
            setSelectedItems((prev) => [...prev, id]);
        } else {
            setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
        }
    };

    const calculateDiscountedPrice = (price, discount) => {
        if (!discount) return price;
        return discount.discountType === 'PERCENT'
            ? Math.max(price * (1 - discount.discountValue / 100), 0)
            : Math.max(price - discount.discountValue, 0);
    };

    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'No Items Selected',
                text: 'Please select at least one item to proceed to checkout.',
                confirmButtonText: 'OK'
            });
            return;
        }

        const selectedCartItems = cartItems.filter(item =>
            selectedItems.includes(item.cartItemId)
        ).map(item => {
            const course = item.course;
            const discount = discountMap[course.courseId];
            return {
                id: item.cartItemId,
                course,
                price: calculateDiscountedPrice(course.price, discount)
            };
        });

        navigate("/confirm-checkout", {state: {checkoutData: selectedCartItems}});
    };

    const selectAll = () => {
        setSelectedItems(cartItems.map(item => item.cartItemId));
    };

    const deselectAll = () => {
        setSelectedItems([]);
    };

    const toggleSelectAll = () => {
        if (selectedItems.length === cartItems.length) {
            deselectAll();
        } else {
            selectAll();
        }
    };

    if (loading) {
        return (
            <div style={{paddingTop: '100px'}} className="d-flex justify-content-center align-items-center"
                 style={{minHeight: '400px'}}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <div style={{paddingTop: '100px', minHeight: '100vh', backgroundColor: '#f8f9fa'}}>
                {cartItems.length === 0 ? (
                    <div className="container">
                        <div className="d-flex flex-column align-items-center justify-content-center"
                             style={{padding: "100px 20px"}}>
                            <div className="text-center mb-4">
                                <i className="fas fa-shopping-cart" style={{fontSize: '80px', color: '#6c757d'}}></i>
                            </div>
                            <h3 className="text-secondary mb-3">Your cart is empty</h3>
                            <p className="text-muted mb-4 text-center">Discover amazing courses to start your learning
                                journey!</p>
                            <button className="btn btn-primary btn-lg px-4" onClick={() => navigate("/")}>
                                <i className="fas fa-arrow-left me-2"></i>Continue Shopping
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="container py-4">
                        <div className="row">
                            <div className="col-12">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h2 className="mb-0">
                                        <i className="fas fa-shopping-cart me-2"></i>Shopping Cart
                                    </h2>
                                    <button className="btn btn-outline-secondary" onClick={() => navigate("/")}>
                                        <i className="fas fa-arrow-left me-2"></i>Continue Shopping
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-lg-8 mb-4">
                                <div className="card shadow-sm">
                                    <div className="card-header bg-white border-bottom">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                                                        onChange={toggleSelectAll}
                                                    />
                                                    <label className="form-check-label fw-bold">
                                                        Select All ({selectedItems.length}/{cartItems.length})
                                                    </label>
                                                </div>
                                            </div>
                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={handleDeleteAll}
                                                disabled={cartItems.length === 0}
                                            >
                                                <i className="fas fa-trash me-1"></i>Clear Cart
                                            </button>
                                        </div>
                                    </div>

                                    <div className="card-body p-0">
                                        {cartItems.map((item, index) => {
                                            const course = item.course;
                                            const discount = discountMap[course.courseId];
                                            const finalPrice = calculateDiscountedPrice(course.price, discount);

                                            return (
                                                <div
                                                    className={`d-flex align-items-center p-4 ${index < cartItems.length - 1 ? 'border-bottom' : ''}`}
                                                    key={item.cartItemId}
                                                >
                                                    <div className="form-check me-3">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            checked={selectedItems.includes(item.cartItemId)}
                                                            onChange={(e) => handleCheckboxChange(e, item.cartItemId)}
                                                        />
                                                    </div>

                                                    <div className="me-3">
                                                        <img
                                                            src={encodeURI(course.imageUrl)}
                                                            alt="Course thumbnail"
                                                            className="rounded"
                                                            style={{width: '100px', height: '75px', objectFit: 'cover'}}
                                                        />
                                                    </div>

                                                    <div className="flex-grow-1 me-3">
                                                        <h6 className="mb-2 fw-bold">{course.title}</h6>
                                                        <p className="text-muted small mb-0">Course • Digital
                                                            Content</p>
                                                    </div>

                                                    <div className="text-end">
                                                        <div className="mb-2">
                                                            {discount ? (
                                                                <>
                                                                    <div className="text-danger fw-bold fs-5">
                                                                        {finalPrice.toLocaleString()} VND
                                                                    </div>
                                                                    <div
                                                                        className="text-muted text-decoration-line-through small">
                                                                        {course.price.toLocaleString()} VND
                                                                    </div>
                                                                    <div className="badge bg-success mb-1">
                                                                        {discount.discountType === 'PERCENT'
                                                                            ? `${discount.discountValue}% OFF`
                                                                            : `${discount.discountValue.toLocaleString()}VND OFF`}
                                                                    </div>
                                                                    {discount.endDate && (
                                                                        <div className="text-warning small">
                                                                            Expires: {formatDate(discount.endDate)}
                                                                        </div>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <div
                                                                    className="fw-bold fs-5">{course.price.toLocaleString()} VND</div>
                                                            )}
                                                        </div>
                                                        <button
                                                            className="btn btn-outline-danger btn-sm"
                                                            onClick={() => handleDelete(item.cartItemId)}
                                                            title="Remove item"
                                                        >
                                                            <span className="fas fa-trash">Remove item</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div className="card shadow-sm sticky-top" style={{top: '120px'}}>
                                    <div className="card-header bg-primary text-white">
                                        <h5 className="mb-0">
                                            <i className="fas fa-receipt me-2"></i>Order Summary
                                        </h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between mb-3">
                                            <span>Selected Items:</span>
                                            <strong>{selectedItems.length}</strong>
                                        </div>

                                        <div className="d-flex justify-content-between mb-3">
                                            <span>Subtotal:</span>
                                            <strong>{(totalPrice + totalDiscount).toLocaleString()} VND</strong>
                                        </div>

                                        {totalDiscount > 0 && (
                                            <div className="d-flex justify-content-between mb-3 text-success">
                                                <span>Discount:</span>
                                                <strong>-{totalDiscount.toLocaleString()} VND</strong>
                                            </div>
                                        )}

                                        <hr/>

                                        <div className="d-flex justify-content-between mb-4">
                                            <span className="fs-5 fw-bold">Total:</span>
                                            <span
                                                className="fs-4 fw-bold text-primary">{totalPrice.toLocaleString()} VND</span>
                                        </div>

                                        {totalDiscount > 0 && (
                                            <div className="alert alert-success small text-center mb-3">
                                                <i className="fas fa-tag me-1"></i>
                                                You saved {totalDiscount.toLocaleString()} VND!
                                            </div>
                                        )}

                                        <button
                                            className="btn btn-success w-100 btn-lg mb-3"
                                            onClick={handleCheckout}
                                            disabled={selectedItems.length === 0}
                                        >
                                            <i className="fas fa-credit-card me-2"></i>
                                            Proceed to Checkout
                                        </button>

                                        <div className="text-center">
                                            <small className="text-muted">
                                                <i className="fas fa-shield-alt me-1"></i>
                                                Secure checkout guaranteed
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer/>
        </>
        );
    };

export default CartDetail;