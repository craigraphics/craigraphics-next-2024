const Logo = () => (
  <>
    <svg className="h-8 w-8 cursor-pointer inline" focusable="false" aria-hidden="true" viewBox="0 0 26 26">
      <g>
        <circle style={{ fill: '#13a1d7' }} cx="13" cy="13" r="5"></circle>
      </g>
      <g>
        <path
          className="fill-primary dark:fill-background"
          d="M13,2c6.07,0,11,4.93,11,11s-4.93,11-11,11S2,19.07,2,13S6.93,2,13,2 M13,0C5.82,0,0,5.82,0,13
		c0,7.18,5.82,13,13,13s13-5.82,13-13C26,5.82,20.18,0,13,0L13,0z"
        />
      </g>
    </svg>
    <span className="ml-1 font-medium text-primary dark:text-primary-dark">craigraphics</span>
  </>
);

export default Logo;
