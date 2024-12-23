import { FC } from 'react';
import { Box, CircularProgress } from '@mui/material';
import styled from '@emotion/styled';

const Loader: FC = () => {
  return (
    <Wrapper data-testid="loader">
      <StyledLoader />
    </Wrapper>
  );
};

export default Loader;

const Wrapper = styled(Box)`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    z-index: 1000;
`;

const StyledLoader = styled(CircularProgress)`
    width: 70px;
    height: 70px;
`;
