import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // "window.scrollTo" cuộn trang về tọa độ (0, 0)
        window.scrollTo(0, 0);
    }, [pathname]); // Theo dõi sự thay đổi của "pathname" (URL)

    return null; // Component này không render gì cả, chỉ có tác dụng phụ
}

export default ScrollToTop;