import React, { useEffect, useRef } from 'react';
import styles from './CafeList.module.css';

const CafeList = ({ cafes, onCafeClick, loadMoreCafes, hasMore, loading }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!bottomRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreCafes();
        }
      },
      { threshold: 0.1 } // Changed threshold to 0.1
    );

    observer.observe(bottomRef.current);

    return () => {
      if (bottomRef.current) {
        observer.unobserve(bottomRef.current);
      }
    };
  }, [hasMore, loading, loadMoreCafes]);

  return (
    <div className={styles.cafeList}>
      {cafes.map((cafe) => (
        <div key={cafe.base} className={styles.cafeItem} onClick={() => onCafeClick(cafe)}>
          <div
            className={styles.cafeItemImage}
            style={{ backgroundImage: cafe.thumbnailUrl ? `url(${cafe.thumbnailUrl})` : 'none' }}
          ></div>
          <div className={styles.cafeItemInfo}>
            <div className={styles.cafeItemName}>{cafe.base}</div>
            <div className={styles.cafeLocationAndMenu}>
              <span className={styles.cafeLocation}>{cafe.행정동명 || '정보없음'}</span>
              {cafe.행정동명 && cafe.추천메뉴 && <span className={styles.separator}> | </span>}
              {cafe.추천메뉴 && cafe.추천메뉴 !== '정보없음' && <span className={styles.cafeMenu}>{cafe.추천메뉴}</span>}
            </div>
          </div>
        </div>
      ))}
      {hasMore && (
        <div ref={bottomRef} style={{ height: '20px', margin: '10px 0', textAlign: 'center' }}>
          {loading ? '로딩 중...' : '더 많은 카페 불러오기'}
        </div>
      )}
      {!hasMore && !loading && cafes.length > 0 && (
        <div style={{ textAlign: 'center', margin: '20px 0' }}>모든 카페를 불러왔습니다.</div>
      )}
    </div>
  );
};

export default CafeList;
