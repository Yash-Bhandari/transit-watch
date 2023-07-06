import styles from './Loading.module.css';
export const Loading = () => (
  <div class={styles['lds-ellipsis']}>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
);
