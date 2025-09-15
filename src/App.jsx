import React, { useState, useEffect } from 'react';
import supabase from './services/supabaseClient';
import CafeList from './components/CafeList';
import Filter from './components/Filter';
import Detail from './components/Detail';
import Popup from './components/Popup';
import { filterConfig } from './services/filterConfig';
import arrowLeftSvg from './assets/arrow-left.svg';
import closeSvg from './assets/close.svg';
import searchSvg from './assets/search.svg';

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
      const config = filterConfig.find(f => f.label === filterName);

      if (!config || filterValue === undefined || (Array.isArray(filterValue) && filterValue.length === 0)) {
        return;
      }

      if (config.type === 'chips') {
        filterValue.forEach(dbField => {
          query = query.eq(dbField, 'O');
        });
      } else {
        query = query.in(config.dbField, filterValue);
      }
    });

    const fetchQuery = async () => {
      const { data, error } = await query.range(from, to);

      if (error) {
        console.error('Error fetching cafes:', error);
        setLoading(false);
        return;
      }
      
      const cafeBases = data.map(cafe => cafe.base);
      let cafesWithImages = [...data];

      if (cafeBases.length > 0) {
        const { data: imagesData, error: imagesError } = await supabase.rpc('get_primary_images_for_bases', { bases: cafeBases });

        if (imagesError) {
          console.error('Error fetching primary images:', imagesError);
        } else {
          const primaryImages = imagesData.reduce((acc, img) => {
            acc[img.base] = img.og_image_url;
            return acc;
          }, {});

          cafesWithImages = data.map(cafe => ({
            ...cafe,
            thumbnailUrl: primaryImages[cafe.base] || null,
          }));
        }
      }
      
      const updateState = (prevState) => {
        if (page === 0) return cafesWithImages;
        const existingIds = new Set(prevState.map(c => c.id));
        const newCafes = cafesWithImages.filter(c => !existingIds.has(c.id));
        return [...prevState, ...newCafes];
      };

      setCafes(updateState);
      setFilteredCafes(updateState);
      setHasMore(data.length === pageSize);
      setLoading(false);
    };
    fetchQuery();
  }, [page, appliedFilters, searchTerm]);

  const loadMoreCafes = () => {
    if (hasMore && !loading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const applyFilters = () => {
    setCafes([]);
    setFilteredCafes([]);
    setPage(0);
    setHasMore(true);
    setView('list');
  };

  const handlePopupApply = (filterLabel, selected) => {
    setAppliedFilters(prev => ({ ...prev, [filterLabel]: selected }));
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
      return <Detail cafe={selectedCafe} />;
    }
    if (view === 'filter') {
      return (
        <>
          <Filter onFilterClick={setActivePopup} appliedFilters={appliedFilters} filterConfig={filterConfig} />
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
          selectedOptions={appliedFilters[activePopup.label] || []}
          onClose={() => setActivePopup(null)}
          onApply={handlePopupApply}
        />
      )}
    </div>
  );
}

export default App;
