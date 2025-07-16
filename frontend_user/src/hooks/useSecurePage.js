import { useEffect } from "react";

export default function useSecurePage() {
  useEffect(() => {
    const handleRightClick = (e) => {
      e.preventDefault();
    };

    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();

      // Chặn các phím mở DevTools
      if (
        key === "f12" ||
        (e.ctrlKey && key === "u") ||
        (e.ctrlKey && e.shiftKey && ["i", "c", "j"].includes(key))
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleRightClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleRightClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
}
