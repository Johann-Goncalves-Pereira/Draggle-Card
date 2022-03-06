import { useRef, useState, useEffect, useCallback } from "react";
import styles from "./Home.module.scss";

export const throttle = (f: { (event: any): void; (arg0: any): void }) => {
  let token: number | null = null,
    lastArgs: any[] | null = null;
  const invoke = () => {
    f(...lastArgs);
    token = null;
  };
  const result = (...args: any[]) => {
    lastArgs = args;
    if (!token) {
      token = requestAnimationFrame(invoke);
    }
  };
  result.cancel = () => token && cancelAnimationFrame(token);
  return result;
};

const id = (x: any) => x;

const useDraggable = ({ onDrag = id } = {}) => {
  const [pressed, setPressed] = useState(false);

  const position = useRef({ x: 0, y: 0 });
  const ref = useRef();

  const unsubscribe = useRef();
  const legacyRef = useCallback((elem) => {
    ref.current = elem;
    if (unsubscribe.current) {
      unsubscribe.current();
    }
    if (!elem) {
      return;
    }
    const handleMouseDown = (e: {
      target: { style: { userSelect: string } };
    }) => {
      e.target.style.userSelect = "none";
      setPressed(true);
    };
    elem.addEventListener("mousedown", handleMouseDown);
    unsubscribe.current = () => {
      elem.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  useEffect(() => {
    if (!pressed) {
      return;
    }

    const handleMouseMove = throttle(
      (event: { movementX: number; movementY: number }) => {
        if (!ref.current || !position.current) {
          return;
        }
        const pos = position.current;

        const elem = ref.current;
        position.current = onDrag({
          x: pos.x + event.movementX,
          y: pos.y + event.movementY,
        });

        // elem.style.transform = `translate(${pos.x * 2.5}px, ${pos.y * 2.5}px)`;
        elem.style = `--posX: ${pos.x * 2}px; --posY: ${pos.y * 2}px;`;
      }
    );
    const handleMouseUp = (e) => {
      e.target.style.userSelect = "auto";
      setPressed(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      handleMouseMove.cancel();
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [pressed, onDrag]);

  return [legacyRef, pressed];
};

function Home() {
  const handleDrag = useCallback(
    ({ x, y }) => ({
      x: Math.max(0, x),
      y: Math.max(0, y),
    }),
    []
  );

  const [ref, pressed] = useDraggable({
    onDrag: handleDrag,
  });

  return (
    <main className={styles.Home}>
      <section
        className={styles.Home__ctnr}
        ref={ref}
        // style={quickAndDirtyStyle}
      >
        <header className={styles.Home__header} aria-labelledby="PageId">
          {/* <p>{pressed ? "Dragging..." : "Press to drag"}</p> */}
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
