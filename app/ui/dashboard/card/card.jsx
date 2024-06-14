import styles from "./card.module.css";

const Card = () => {
  return (
    <>
      <div className={styles.titleContainer}>
        <div className={styles.title}> Commencez avec une photo</div>
        <div className={styles.subtile}> Glissez votre photo ici</div>
      </div>

      <button className={styles.uploadButton}> Upload File</button>
    </>
  );
};
export default Card;
