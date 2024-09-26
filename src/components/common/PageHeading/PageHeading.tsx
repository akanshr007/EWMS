import "./PageHeading.scss";

type PropTypes = {
  className?: string;
  title?: string;
  subTitle?: string;
};

const PageHeading = ({ className, title, subTitle }: PropTypes) => {
  return (
    <div className={`page_heading ${className || ""}`}>
      <h2>{title}</h2>
      {subTitle && <p>{subTitle}</p>}
    </div>
  );
};

export default PageHeading;
