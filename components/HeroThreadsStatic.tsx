import React from "react";
import styles from "./HeroThreadsStatic.module.css";

const HeroThreadsStatic = () => {
  const Token = () => (
    <span className={styles.token}>
      <span className={styles.textReel}>REEL</span>
      <span className={styles.textWhite}>HAUS</span>
    </span>
  );

  const renderRow = () => (
    <span>{Array.from({ length: 10 }).map((_, i) => <Token key={i} />)}</span>
  );

  return (
    <div id="threads-bg" className={styles.heroBackground} aria-hidden="true">
      <div className={`${styles.ribbon} ${styles.ribbonWhite}`}>
        <div className={styles.inner}>{renderRow()}{renderRow()}</div>
      </div>
      <div className={`${styles.ribbon} ${styles.ribbonBlack}`}>
        <div className={styles.inner}>{renderRow()}{renderRow()}</div>
      </div>
      <div className={`${styles.ribbon} ${styles.ribbonWhite}`}>
        <div className={styles.inner}>{renderRow()}{renderRow()}</div>
      </div>
      <div className={`${styles.ribbon} ${styles.ribbonBlack}`}>
        <div className={styles.inner}>{renderRow()}{renderRow()}</div>
      </div>
      <div className={`${styles.ribbon} ${styles.ribbonWhite}`}>
        <div className={styles.inner}>{renderRow()}{renderRow()}</div>
      </div>
    </div>
  );
};

export default HeroThreadsStatic;