import { useState, useEffect, PureComponent, createRef } from "react";
import styles from "./Home.module.scss";

const throttle = (f: { (): void; (arg0: any): void }) => {
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

const _classes = `draggable ${styles.Home__ctnr}`;
class Draggable extends PureComponent {
  _relX = 0;
  _relY = 0;
  _ref = createRef();

  _onMouseDown = (event: {
    button: number;
    pageX: number;
    pageY: number;
    preventDefault: () => void;
  }) => {
    if (event.button !== 0) {
      return;
    }
    const { scrollLeft, scrollTop, clientLeft, clientTop } = document.body;
    // Try to avoid calling `getBoundingClientRect` if you know the size
    // of the moving element from the beginning. It forces reflow and is
    // the laggiest part of the code right now. Luckily it's called only
    // once per click.
    const { left, top } = this._ref.current.getBoundingClientRect();
    this._relX = event.pageX - (left + scrollLeft - clientLeft);
    this._relY = event.pageY - (top + scrollTop - clientTop);
    document.addEventListener("mousemove", this._onMouseMove);
    document.addEventListener("mouseup", this._onMouseUp);
    event.preventDefault();
  };

  _onMouseUp = (event: { preventDefault: () => void }) => {
    document.removeEventListener("mousemove", this._onMouseMove);
    document.removeEventListener("mouseup", this._onMouseUp);
    event.preventDefault();
  };

  _onMouseMove = (event: {
    pageX: number;
    pageY: number;
    preventDefault: () => void;
  }) => {
    this.props.onMove(event.pageX - this._relX, event.pageY - this._relY);
    event.preventDefault();
  };

  private _update = throttle(() => {
    const { x, y } = this.props;
    this._ref.current.style = `--posX:${x}px;--posY:${y}px`;
  });
  public get update() {
    return this._update;
  }
  public set update(value) {
    this._update = value;
  }

  componentDidMount() {
    this._ref.current.addEventListener("mousedown", this._onMouseDown);
    this._update();
  }

  componentDidUpdate() {
    this._update();
  }

  componentWillUnmount() {
    this._ref.current.removeEventListener("mousedown", this._onMouseDown);
    this._update.cancel();
  }

  render() {
    return (
      <section className={_classes} ref={this._ref}>
        {this.props.children}
      </section>
    );
  }
}

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

class Home extends PureComponent {
  state = {
    x: 450,
    y: 400,
  };

  _move = (x: any, y: any) => this.setState({ x, y });

  render() {
    const { x, y } = this.state;

    return (
      <main className={styles.Home}>
        <Draggable x={x} y={y} onMove={this._move}>
          <header className={styles.Home__header} aria-labelledby="PageId">
            <div className={styles.dotsWrapper}>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <h1 id="PageId">Home Page - Code Window</h1>
          </header>
          <section className={styles.Home__body}>
            <h2>Drag me!!</h2>
          </section>
        </Draggable>
      </main>
    );
  }
}

export default Home;
