import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { attributes as attributesAtom } from "../atoms";
import api from "@api";
import { sort } from "fast-sort";

const useAttributes = id => {
  const [attributes, setAttributes] = useState([]);

  useEffect(() => {
    const fetchAttributes = async () => {
      let data = await api(id, "attributes");
      console.log(data);

      setAttributes(
        data.attributes.map(attribute => {
          return {
            ...attribute,
            values: sort(attribute.values).desc(item => item.count)
          };
        })
      );
    };

    if (id) {
      fetchAttributes();
    }
  }, [id]);

  return attributes;
};

export default useAttributes;
