import styled from 'styled-components';

export const InputWrapper = styled.View`
  flex: 1;
  /* justify-content: center; */
  /* align-items: center; */
  /* width: 100%;
  height: 10%; */
  background-color: #ffffff;
  margin-bottom:10px;
  border-width:2px;
  border-color:lightgrey;
  border-radius:10px;
  
`;

export const InputField = styled.TextInput`
  justify-content: center;
  align-items: center;
  font-size: 24px;
  text-align: center;
  width: 90%;
`;
export const AddImage = styled.Image`
  width: 100%;
  height: 250px;
  margin-bottom: 15px;
  border-width: 1px;
  border-color: lightgrey;
  border-radius: 10px;
`;
export const LoadImg = styled.View`
  /* justify-content: center; */
  /* align-items:center; */
  width: 100%;
  height: 250px;
  margin-bottom: 15px;
  border-width: 2px;
  border-color: lightgrey;
  border-radius: 10px;
`;
export const LoadedImg = styled.View`
  /* justify-content: center; */
  /* align-items:center; */
  width: 100%;
  height: 250px;
  margin-bottom: 15px;
  border-width: 2px;
  border-color: lightgrey;
  border-radius: 10px;
`;
export const StatusWrapper = styled.View`
  justify-content: center;
  align-items: center;
`;
export const SubmitBtn = styled.TouchableOpacity`
  flex-direction: row;
  align-items:center;
  justify-content: center;
  background-color: #2e64e5;
  border-radius: 60px;
  padding: 10px 25px;
  width: 150px;
  height: 60px;
`;
export const SubmitBtnText = styled.Text`
  font-size: 18px;
  font-family: 'Lato-Bold';
  font-weight: bold;
  color: #ffffff;
`;
