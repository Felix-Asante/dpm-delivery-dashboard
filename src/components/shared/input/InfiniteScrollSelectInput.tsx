import { theme } from "@/config/constants/theme";
import { apiConfig } from "@/lib/apiConfig";
import { toQuery } from "@/utils/helpers";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import FormControl from "./FormControl";

interface SelectProps {
  url: string;
  required?: boolean;
  isSearchable?: boolean;
  isLoading?: boolean;
  defaultValue?: any;
  onChange?: (option: Object) => void | null;
  placeholder?: string;
  label?: string;
  query?: string;
  formatOptions?: (option?: any) => void;
  getOptionLabel?: (option?: any) => void;
  getOptionValue?: (option?: any) => void;
  isOptionSelected?: (option: any, selectedValues: any[]) => boolean;
}
const InfiniteScrollSelect = React.forwardRef(function Input(
  props: SelectProps,
  ref
) {
  const {
    url,
    required = false,
    isSearchable = true,
    isLoading = false,
    defaultValue = "",
    query = "",
    onChange = null,
    placeholder = "Select an option",
    formatOptions,
    label,
    ...rest
  } = props;

  const [loading, setLoading] = useState(false);
  const selectRef = useRef<any>(null);

  const [selectedOption, setSelectedOption] = useState<any>(null);

  useEffect(() => {
    onChange && onChange(defaultValue?.id);
  }, [defaultValue, onChange]);

  const session = useSession();

  async function loadOptions(search: string, options: any, additional: any) {
    try {
      setLoading(true);
      const endpoint = `${apiConfig.baseUrl}${url}${toQuery({
        page: additional?.nextPage || 1,
        limit: 10,
        query: query || search,
      })}`;

      const results: any = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${session?.data?.idToken}` },
      });
      const response = await results.json();
      const totalPages = response?.meta?.totalPages || 1;

      const currentPage = additional?.nextPage || 1;
      const fetchedOptions = response?.items || response || [];
      const formattedOptions = formatOptions
        ? formatOptions(fetchedOptions)
        : fetchedOptions;
      return {
        options: formattedOptions,
        hasMore: totalPages > currentPage,
        additional: {
          currentPage,
          nextPage: currentPage + 1,
        },
      };
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <FormControl.Label className="mb-1">{label}</FormControl.Label>
      <AsyncPaginate
        // @ts-ignore
        loadOptions={loadOptions}
        onChange={(option) => {
          setSelectedOption(option);
          onChange && onChange(option?.id);
        }}
        placeholder={placeholder}
        isLoading={loading || isLoading}
        isSearchable={isSearchable}
        isMulti={false}
        maxMenuHeight={200}
        minMenuHeight={200}
        loadingMessage={() => <p>fetching options...</p>}
        filterOption={(option, searchValue) => {
          const value = option?.label || option?.name;
          return value?.toLowerCase().includes(searchValue?.toLowerCase());
        }}
        theme={(inputTheme) => ({
          ...inputTheme,
          colors: {
            ...inputTheme.colors,
            primary: theme.colors.primary.DEFAULT,
          },
        })}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            boxShadow: state.isFocused
              ? "rgb(129, 227, 249) 0rem 0rem 0rem 0.125rem"
              : "none",
          }),
          menu: (base) => ({
            ...base,
            fontFamily: "sans-serif",
            fontSize: "15px",
          }),
          menuPortal: (base) => ({
            ...base,
            zIndex: 1400,
            fontFamily: "sans-serif",
            fontSize: "15px",
          }),
        }}
        menuPosition={"absolute"}
        menuPortalTarget={document?.body}
        cacheUniqs={[url]}
        selectRef={selectRef}
        defaultInputValue={defaultValue}
        {...rest}
        value={selectedOption}
      />
    </div>
  );
});

export default InfiniteScrollSelect;
