import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Mousewheel } from 'swiper';

import 'swiper/css';

SwiperCore.use([Mousewheel]);

const TagButtons = styled.div`
  max-width: 80.4rem;
  margin: auto;
  padding: 0 2.1rem;

  & .swiper-slide {
    min-height: 3.8rem;
    background-color: #ffbd6f;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 2.5rem;
    box-shadow: 3px 4px 4px rgba(0, 0, 0, 0.25);
    font-style: normal;
    font-weight: bold;
    font-size: 2.2rem;
    line-height: 2.2rem;
    color: rgba(13, 24, 37, 0.8);
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }

  & .gray-loading-placeholder {
    max-width: 10rem;
    background-color: lightgray;
  }
`;

const calculateTagWidth = (s) => {
  const lowerCase = (s.match(/([a-z])/g)?.length || 0) * 1.8;
  const upperCase = (s.match(/([A-Z])/g)?.length || 0) * 2.8;
  const cjkLetter =
    (new TextEncoder('utf-16').encode(s).length - s.length || 0) * 1.35;
  return lowerCase + upperCase + cjkLetter;
};

const MusicTags = ({ tags, currentTagIndex, setCurrentTagIndex }) => {
  return (
    <TagButtons>
      <Swiper
        className="tagSwiper"
        spaceBetween={18}
        slidesPerView={'auto'}
        mousewheel={true}
      >
        {tags
          ? tags?.map((tag, index) => (
              <SwiperSlide
                key={index}
                data-id={tag.tag_id}
                style={{
                  backgroundColor:
                    currentTagIndex == tag.tag_id
                      ? 'rgba(81, 163, 30, 0.5)'
                      : '#ffbd6f',
                  maxWidth: `${calculateTagWidth(tag.tag_name)}rem`,
                  cursor: 'pointer',
                }}
                onClick={(e) => setCurrentTagIndex(e.target.dataset.id)}
              >
                {tag.tag_name}
              </SwiperSlide>
            ))
          : Array(5)
              .fill(null)
              .map((item, index) => {
                return (
                  <SwiperSlide
                    key={index}
                    className="gray-loading-placeholder"
                  ></SwiperSlide>
                );
              })}
      </Swiper>
    </TagButtons>
  );
};

export default MusicTags;
