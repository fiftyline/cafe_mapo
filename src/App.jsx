import React, { useState, useEffect } from 'react';
import supabase from './services/supabaseClient';
import CafeList from './components/CafeList';
import Filter from './components/Filter';
import Detail from './components/Detail';
import Popup from './components/Popup';
import { otherFiltersConfig, filterConfig } from './services/filterConfig';
import arrowLeftSvg from './assets/arrow-left.svg';
import closeSvg from './assets/close.svg';
import searchSvg from './assets/search.svg';

// 필터 옵션 정의
const FILTER_OPTIONS = {
  목적: ['조용히 쉬기', '대화', '카공/작업', '정보없음'],
  분위기: ['감성적', '모던', '빈티지', '특별함/개성있음', '정보없음'],
  웨이팅: ['가끔있음', '긴 웨이팅', '정보부족'],
  콘센트: ['있음', '많음', '정보부족'],
  의자: ['편함', '정보부족'],
  테이블: ['넓고 낮지않음', '좁거나 낮음', '정보부족'],
  소음: ['조용함', '정보부족'],
  조명: ['밝음', '어두움', '정보부족'],
  '좌석 간격': ['넓음', '좁음', '정보부족'],
  규모: ['적당함', '작은 편', '큰 편/대형카페', '정보부족'],
  음료: ['맛있거나 평범', '월등히 맛있음', '정보부족'],
  디저트: ['맛있거나 평범', '월등히 맛있음', '정보부족'],
  '영업마감': ['8시 전', '11시 전', '24시간 영업', '정보부족'],
};

function App() {
  const [cafes, setCafes] = useState([]);
  const [filteredCafes, setFilteredCafes] = useState([]);
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [view, setView] = useState('list'); // 'list', 'filter', 'detail'
  const [activePopup, setActivePopup] = useState(null); // 현재 활성화된 팝업
  const [appliedFilters, setAppliedFilters] = useState({});
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 데이터 로딩
  useEffect(() => {
    setLoading(true);
    const from = page * pageSize;
    const to = from + pageSize - 1;

    let query = supabase.from('cafes').select('*');

    // Apply search term
    if (searchTerm) {
      query = query.ilike('base', `%${searchTerm}%`);
    }

    // Apply filters to the query
    Object.keys(appliedFilters).forEach(filterName => {
      const filterValue = appliedFilters[filterName];

      if (filterValue === undefined || (Array.isArray(filterValue) && filterValue.length === 0)) {
        return;
      }

      const isOtherFilter = otherFiltersConfig.some(f => f.label === filterName);

      if (isOtherFilter) {
        if (filterValue === 'O') {
          query = query.eq(filterName, 'O');
        }
      } else {
        const selectedOptions = filterValue;
        query = query.in(filterName, selectedOptions);
      }
    });

    const fetchQuery = async () => {
      const { data, error } = await query.range(from, to);

      if (error) {
        console.error('Error fetching cafes:', error);
      } else {
        setCafes(prevCafes => (page === 0 ? data : [...prevCafes, ...data]));
        setFilteredCafes(prevFilteredCafes => (page === 0 ? data : [...prevFilteredCafes, ...data]));
        setHasMore(data.length === pageSize);
      }
      setLoading(false);
    };
    fetchQuery();
  }, [page, appliedFilters, searchTerm]);

  const fetchCafesData = async (currentPage, currentSize, filters) => {
    // This function is no longer needed as useEffect handles data fetching
  };

  const loadMoreCafes = () => {
    if (hasMore && !loading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  // 필터 적용 로직
  const applyFilters = () => {
    setCafes([]);
    setFilteredCafes([]);
    setPage(0);
    setHasMore(true);
    setView('list');
  };

  // 팝업에서 필터 적용시
  const handlePopupApply = (filter, options) => {
    if (otherFiltersConfig.some(f => f.label === filter)) {
      // Handle '기타' filters
      setAppliedFilters(prev => ({
        ...prev,
        [filter]: options.length > 0 ? 'O' : undefined,
      }));
    } else {
      // Handle regular filters
      setAppliedFilters(prev => ({ ...prev, [filter]: options }));
    }
    setActivePopup(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCafes([]);
    setFilteredCafes([]);
    setPage(0);
    setHasMore(true);
  };

  const renderHeader = () => {
    if (view === 'detail') {
      return (
        <div className="detail-header">
          <button className="back-button" onClick={() => setView('list')}>
            <img src={arrowLeftSvg} alt="Back" />
          </button>
          <h1 className="detail-title">{selectedCafe?.base}</h1>
        </div>
      );
    }
    if (view === 'filter') {
      return (
        <div className="filter-screen-header">
          <h1 className="filter-screen-title">카페 상세 필터링</h1>
          <button className="close-button" onClick={() => setView('list')}>
             <img src={closeSvg} alt="Close" />
          </button>
        </div>
      );
    }
    return (
      <div className="header">
        <div className="header-title-container">
          <h1 className="header-title">나를 위한 카페 찾기</h1>
          <p className="header-location">서울 마포구</p>
        </div>
        <div className="search-bar-container">
          <div className="search-bar-icon-wrapper">
            <img src={searchSvg} alt="Search" className="search-icon" />
          </div>
          <input
            type="text"
            placeholder="카페 이름 검색"
            className="search-input"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (view === 'detail') {
      return <Detail cafe={selectedCafe} appliedFilters={appliedFilters} />;
    }
    if (view === 'filter') {
      return (
        <>
          <Filter onFilterClick={setActivePopup} appliedFilters={appliedFilters} filterConfig={filterConfig} otherFiltersConfig={otherFiltersConfig} />
          <div className="filter-actions">
            <button className="filter-action-button reset-button" onClick={() => setAppliedFilters({})}>초기화</button>
            <button className="filter-action-button apply-button" onClick={applyFilters}>적용하기</button>
          </div>
        </>
      );
    }
    return (
        <>
            <CafeList 
                cafes={filteredCafes} 
                onCafeClick={(cafe) => {
                    setSelectedCafe(cafe);
                    setView('detail');
                }}
                loadMoreCafes={loadMoreCafes}
                hasMore={hasMore}
                loading={loading}
            />
        </>
    );
  };

  return (
    <div className="app-container">
      {renderHeader()}
      {renderContent()}
      {view === 'list' && (
        <div className="fixed-bottom-button-container">
          <button className="filter-button" onClick={() => setView('filter')}>
            카페 상세 필터링
          </button>
        </div>
      )}
      {activePopup && (
        <Popup
          filter={activePopup}
          options={FILTER_OPTIONS[activePopup] || []} // Ensure options is always an array
          selectedOptions={
            otherFiltersConfig.some(f => f.label === activePopup) && appliedFilters[activePopup] === 'O'
              ? [activePopup] // For '기타' filters, if 'O' is applied, pass the filter label as selected
              : appliedFilters[activePopup] || [] // For regular filters, pass the array of selected options
          }
          onClose={() => setActivePopup(null)}
          onApply={handlePopupApply}
        />
      )}
    </div>
  );
}

export default App;
