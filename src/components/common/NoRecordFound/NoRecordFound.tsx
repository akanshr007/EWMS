import "./NoRecordFound.scss";

const NoRecordFound = ({title, colSpan} : {title?: string; colSpan?:any;}) => {
  return (
    <td className="nothing_found py-5" colSpan={colSpan}>
      <h4>{title ? title : "No Record Found"}</h4>
    </td>
  );
};

export default NoRecordFound;
