import { DropdownButton, DropdownMenu } from ".";

const mockMenuOptions = [
  { name: 'Division 1', id: 1, data: [] },
  { name: 'Division 2', id: 2, data: [] },
  { name: 'Division 3', id: 3, data: [] },
  { name: 'Division 4', id: 4, data: [] },
  { name: 'Division 5', id: 5, data: [] },
]

export const dropdownButton = (): JSX.Element => (
  <DropdownButton dropdownText="Division 1" onClick={() => {}} open />
);

export const dropdownMenu = (): JSX.Element => (
  <DropdownMenu
    optionChosen={{ name: 'Division 1', id: 1, data: [] }}
    options={mockMenuOptions}
    menuTitle="Choose a division"
    onOptionClick={() => {}}
  />
);

export default {
  title: 'Components/Dropdown',
  component: dropdownButton,
};
