import { useEffect, useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";

export const DatePickerr = () => {
  const [value, setValue] = useState([
    new DateObject(),
    new DateObject().add(2, "days"),
    new DateObject().add(10, "days"),
  ]);
  const [date, setDate] = useState<string[]>([])

  useEffect(() => {

    

  },[value])

  console.log(`${value[0].year}-${value[0].month}-${value[0].day}`);

  return (
    <DatePicker
      value={value}
      onChange={setValue}
      multiple
      plugins={[<DatePanel sort="date" />]}
    />
  );
};
