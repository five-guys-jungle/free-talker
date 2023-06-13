import React, { useState } from "react";
// import { Button, TextField, Container, Typography } from "@mui/material";
import axios, { AxiosError } from "axios";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
// import MySnackbar from "./MySnackBar";

const DB_URL = process.env.REACT_APP_DB_URL || "http://localhost:3003";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));

interface DialogTitleProps {
    id: string;
    children?: React.ReactNode;
    onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}

export default function SignUpDialog() {
    const [open, setOpen] = useState(false);

    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [nickname, setNickname] = useState("");

    const [formErrors, setFormErrors] = useState<Record<string, boolean>>({
        userId: false,
        password: false,
        nickname: false,
    });
    const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);

    const handleClickOpen = (): void => {
        setOpen(true);
    };

    const handleClose = (): void => {
        setOpen(false);
    };

    async function handleSignUp() {
        // 빈칸 체크
        const errors: Record<string, boolean> = {
            userId: !userId,
            password: !password,
            nickname: !nickname,
        };
        setFormErrors(errors);

        // 모든 필드가 채워져 있지 않으면 가입불가
        if (Object.values(errors).some((error) => error)) {
            return;
        }
        const body = {
            userId: userId,
            userPw: password,
            userNickname: nickname,
        };

        try {
            const response = await axios.post(`${DB_URL}/user/login`, body);

            if (response.data.statue === 200) {
                console.log("Success!!");
            }
        } catch (e) {
            console.log(e);
        }

        setSuccessSnackbarOpen(true);
        handleClose();
    }

    const handleSnackbarClose = (): void => {
        setSuccessSnackbarOpen(false);
    };

    return (
        <div>
            <Button
                variant="contained"
                color="primary"
                type="submit"
                size="large"
                form="login"
                onClick={handleClickOpen}
                sx={{ marginBottom: "10px" }}
            >
                회원가입
            </Button>
            <BootstrapDialog onClose={handleClose} open={open}>
                <BootstrapDialogTitle
                    id="customized-dialog-title"
                    onClose={handleClose}
                >
                    회원가입
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    {/* 회원가입 폼 요소 추가 */}
                    <TextField
                        label="아이디"
                        type="ID"
                        fullWidth
                        margin="normal"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        error={formErrors.userId}
                        helperText={
                            formErrors.userId ? "빈칸을 채워주세요" : ""
                        }
                    />
                    <TextField
                        label="비밀번호"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={formErrors.password}
                        helperText={
                            formErrors.password ? "빈칸을 채워주세요" : ""
                        }
                    />
                    <TextField
                        label="닉네임"
                        type="nickname"
                        fullWidth
                        margin="normal"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        error={formErrors.nickname}
                        helperText={
                            formErrors.nickname ? "빈칸을 채워주세요" : ""
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        // autoFocus
                        onClick={handleSignUp}
                        variant="contained"
                    >
                        가입하기
                    </Button>
                </DialogActions>
            </BootstrapDialog>
            <Snackbar
                open={successSnackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <MuiAlert
                    onClose={handleSnackbarClose}
                    severity="success"
                    sx={{ width: "100%" }}
                >
                    회원가입이 완료되었습니다!
                </MuiAlert>
            </Snackbar>
        </div>
    );
}