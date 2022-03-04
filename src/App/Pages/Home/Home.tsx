import { useEffect, useState } from "react";
import styles from "./Home.module.scss";

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (event: {
      clientX: number;
      clientY: number;
    }) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    const listener = window.addEventListener("mousemove", updateMousePosition);

    listener;
    return () => listener;
  }, []);

  return mousePosition;
};

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export function useWindowDimensions() {
  const [useWindowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleSize() {
      setWindowDimensions(getWindowDimensions());
    }

    const wd = window.addEventListener("resize", handleSize);

    wd;
    return () => wd;
  }, []);

  return useWindowDimensions;
}

function Home() {
  // const { height, width } = useWindowDimensions();
  const { x, y } = useMousePosition();
  const { height, width } = useWindowDimensions();

  const posHandler = {
    color: "",
    "--posX": `${x - 300}px`,
    "--posY": `${y - 25}px`,
    "--width": `${width}px`,
    "--height": `${height}px`,
  };

  // console.log(x, y);

  return (
    <main className={styles.Home}>
      <section className={styles.Home__ctnr} style={posHandler}>
        <header className={styles.Home__header} aria-labelledby="PageId">
          <div className={styles.dotsWrapper}>
            <span></span>
            <span></span>
            <span></span>
          </div>

          <h1 id="PageId">Home Page - Code Window</h1>
        </header>
        <section className={styles.Home__body}>
          <button>Find a file</button>
        </section>
      </section>
    </main>
  );
}

export default Home;
