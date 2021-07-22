import { Checkbox } from '@material-ui/core';
import styled from 'styled-components';

export const StyledCheckbox = styled(Checkbox)`
	justify-self: flex-start;

	&.MuiIconButton-colorSecondary:hover,
	&.MuiCheckbox-colorSecondary.Mui-checked:hover {
		background-color: transparent;
	}

	&.MuiCheckbox-colorSecondary.Mui-checked {
		color: var(--blue);
	}

	&.MuiCheckbox-root {
		color: var(--black);
		padding: 0;
		margin-left: -2px;
	}
`;
