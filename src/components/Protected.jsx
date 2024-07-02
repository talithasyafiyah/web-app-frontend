import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkToken } from "../redux/actions/authActions";
import { useDispatch } from "react-redux";

const Protected = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkToken(navigate));
  }, [dispatch]);

  return;
};

export default Protected;
