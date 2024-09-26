import { ReactNode } from "react";
import "./Table.scss";
import { Table as ReactTable } from "react-bootstrap";
import NothingFound from "../NoRecordFound/NoRecordFound";

type field = {
  name: string;
  colSpan?: number;
  className?: string;
};
type propTypes = {
  className?: string;
  // fields?: field[];
  fields?: any[];
  children?: ReactNode;
};

const Table = (props: propTypes) => {
  return (
    <ReactTable responsive className={`${props.className || ""} custom_table`}>
      {props.fields && (
        <thead>
          <tr>
            {props.fields.map((item) => {
              return (
                <th key={item.name} className={item.className || ""} colSpan={item?.colSpan}>
                  {item.name}
                </th>
              );
            })}
          </tr>
        </thead>
      )}
      <tbody>
        {props.children || (
          <tr>
            <td className="nothing_found_td" colSpan={props.fields?.length}>
              <NothingFound />
            </td>
          </tr>
        )}
      </tbody>
    </ReactTable>
  );
};

export default Table;
