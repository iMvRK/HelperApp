import styled from 'styled-components';

export const Container = styled.View`
  flex: 1;
  align-content: center;
  background-color: #fff;
  padding-left: 15px;
  padding-right:15px;
  padding-top:5px;
  padding-bottom:5px;
`;

export const Card = styled.View`
  background-color: #f8f8f8;
  width: 100%;
  margin-bottom: 20px;
  border-radius: 10px;
`;
export const UserInfo = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  padding: 15px;
`;
export const UserImg = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
`;

export const UserInfoText = styled.View`
  flex-direction: column;
  justify-content: center;
  margin-left: 10px;
`;

export const UserName = styled.Text`
  font-size: 14px;
  font-weight: bold;
  font-family: 'Lato-Regular';
`;
export const PostTime = styled.Text`
  font-size: 12px;
  font-family: 'Lato-Regular';
  color: #666;
`;
export const PostType = styled.Text`
  font-size: 14px;
  font-family: 'Lato-Regular';
  font-weight: bold;
  padding-left: 15px;
  padding-right: 15px;
  margin-bottom: 2px;
`;

export const PostText = styled.Text`
  font-size: 14px;
  font-family: 'Lato-Regular';
  padding-left: 15px;
  padding-right: 15px;
  margin-bottom:15px;
`;
export const PostImg = styled.Image `
  /* resizeMode: contain; */
  width: 100%;
  height: 250px;
  margin-top: 15px;
`;
export const DividerLine = styled.View`
  border-bottom-color: #dddddd90;
  border-bottom-width: 1px;
  width: 92%;
  align-self:center;
  margin-top: 15px;
`;

export const InteractionWrapper = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
  padding: 15px;
`;
export const Interaction = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  border-radius: 5px;
  padding: 2px 5px;
  background-color: ${props => props.active ? '#2e64e515' : 'transparent'}
`;
export const InteractionText = styled.Text`
  font-size: 12px;
  font-family: 'Lato-Regular';
  font-weight: bold;
  color: ${(props) => (props.active ? '#2e64e5' : '#333')};
  margin-top: 5px;
  margin-left: 5px;
`;
