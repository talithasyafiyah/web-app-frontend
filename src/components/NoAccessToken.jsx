import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { noAccessToken } from "../redux/actions/authActions";
import { useDispatch } from "react-redux";

const NoAccessToken = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(noAccessToken(navigate));
  }, [dispatch]);

  return;
};

export default NoAccessToken;
