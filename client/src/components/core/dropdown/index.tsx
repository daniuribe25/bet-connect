import {
  Button,
  Chevron,
  Text,
  MenuWrapper,
  MenuHeader,
  OptionWrapper,
  InnerWrapper,
  OptionTitle,
  SecondaryText,
} from './dropdown.styles';

type DropdownButtonProps = {
  dropdownText: string;
  onClick: () => void;
  open: boolean;
}

type MenuProps = {
  menuTitle: string;
  onOptionClick: (option: any) => void;
  optionChosen: any;
  options: Array<{
    name: string;
    id: number;
    data: any[];
    label?: string;
  }>;
}

export const DropdownButton = ({
  dropdownText,
  onClick,
  open,
}: DropdownButtonProps): JSX.Element => (
  <Button onClick={onClick}>
    <Chevron icon={open ? 'action:arrowUp' : 'action:arrowDown'} />
    <Text>{dropdownText}</Text>
  </Button>
);

export const DropdownMenu = ({ options, menuTitle, onOptionClick, optionChosen }: MenuProps): JSX.Element => {
  return (
    <MenuWrapper>
      <MenuHeader>{menuTitle}</MenuHeader>
      {options.map((option, index) => {
        const { name, id, label } = option;
        const optionIsSelected = option.id === optionChosen.id;
        const displayBottomBorder = options.length - 1 !== index;
        return (
          <OptionWrapper onClick={() => onOptionClick(option)} key={id} optionIsSelected={optionIsSelected}>
            <InnerWrapper displayBottomBorder={displayBottomBorder}>
              <OptionTitle>{name}</OptionTitle>
              {label && <SecondaryText>{label}</SecondaryText>}
            </InnerWrapper>
          </OptionWrapper>
        )
      })}
    </MenuWrapper>
  )
}
