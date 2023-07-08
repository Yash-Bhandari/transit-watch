import styles from './Loading.module.css';
export const Loading = () => (
  <div className={styles['lds-ellipsis']}>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
);
