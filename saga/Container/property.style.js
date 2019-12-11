import styled from 'styled-components';
import { palette, size } from 'styled-theme';

const CardDataWithIcon = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 30px;
  text-align: center;
  div {
    width: 50%;
  }
  img {
    width: 12%;
  }
  h2 {
    vertical-align: middle;
    margin: 0 0 0 10px;
    display: inline-block;
  }
  p {
    padding-top: 10px;
  }
`;
const FooterFlex = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
`;
const GraphWrapper = styled.div`
  overflow-x: scroll;
  background: #fff;
  padding: 20px;
  width: 100%;
  border: 1px solid ${palette('border', 0)};
`;

const StatusIndicator = styled.span`
  width: 3em;
  height: 0.9em;
  border-radius: 5px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  display: block;
`;

const ButtonWrapper = styled.div`
  @media ${size('max_xs')} {
    width: 100%;
  }
  .button {
    @media ${size('max_md')} {
      width: auto;
    }
    @media ${size('max_xs')} {
      width: 100%;
    }
  }
`;

const AccountWrapper = styled.div`
  height: 350px;
  overflow-y: scroll;
  padding-right: 10px;
  margin-bottom: 10px;

  /* width */
  ::-webkit-scrollbar {
    width: 5px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #f1f4f6;
    border-radius: 50px;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #aaaaaa;
    border-radius: 50px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #848484;
  }
`;
export {
  CardDataWithIcon,
  FooterFlex,
  GraphWrapper,
  StatusIndicator,
  AccountWrapper,
  ButtonWrapper,
};
