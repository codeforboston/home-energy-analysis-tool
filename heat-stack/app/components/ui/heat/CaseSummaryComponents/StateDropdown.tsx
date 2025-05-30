import React, { useState, useEffect } from 'react';
import { ErrorList } from './ErrorList';

// Define the list of state abbreviations
const stateAbbreviations = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

interface Props {
  fields: {
    state: {
      value: string;
      errorId: string;
      errors: string[];
    };
  };
  getInputProps: (field: any, props: any) => any;
  subSubTitleClass: string;
}

export const StateDropdown: React.FC<Props> = ({ fields, getInputProps, subSubTitleClass }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedState, setSelectedState] = useState(fields.state.value);
  const [filteredStates, setFilteredStates] = useState(stateAbbreviations);

  useEffect(() => {
    setSelectedState(fields.state.value);
  }, [fields.state.value]);

  const handleStateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedState(value);
    fields.state.value = value;
    setFilteredStates(stateAbbreviations.filter(state => state.toLowerCase().includes(value.toLowerCase())));
  };

  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSuggestionClick = (abbreviation: string) => {
    setSelectedState(abbreviation);
    fields.state.value = abbreviation;
    setIsOpen(false);
  };

  return (
    <div className="basis-1/3">
      <label className={`${subSubTitleClass}`} htmlFor="state">
        State (Abbreviation)
      </label>
      <div className="mt-4 relative">
        <input
          {...getInputProps(fields.state, { type: 'text' })}
          value={selectedState}
          onChange={handleStateChange}
          onFocus={handleDropdownToggle}
          onBlur={() => setIsOpen(false)}
          className="w-full px-4 py-2 border rounded"
        />
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg">
            {filteredStates.map((abbreviation) => (
              <div
                key={abbreviation}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSuggestionClick(abbreviation)}
              >
                {abbreviation}
              </div>
            ))}
          </div>
        )}
        <div className="min-h-[32px] px-4 pb-3 pt-1">
          <ErrorList
            id={fields.state.errorId}
            errors={fields.state.errors}
          />
        </div>
      </div>
    </div>
  );
};