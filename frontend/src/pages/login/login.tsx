import { Alert, Button, Card, Form, Input, Typography } from 'antd';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

import type { LoginCredentials } from '@/entities/auth';
import { useLoginMutation } from '@/entities/auth';
import { routePaths } from '@/shared/config';

import style from './style.module.scss';

interface LoginLocationState {
  from?: string;
}

interface ErrorResponse {
  message?: string | string[];
}

const getErrorMessage = (error: unknown): string => {
  if (!axios.isAxiosError<ErrorResponse>(error)) {
    return 'Не удалось выполнить вход';
  }

  const message = error.response?.data.message;
  if (Array.isArray(message)) return message.join(', ');
  if (typeof message === 'string') return message;

  return error.response?.status === 401
    ? 'Неверный логин или пароль'
    : 'Сервис авторизации недоступен';
};

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const login = useLoginMutation();
  const returnPath = (location.state as LoginLocationState | null)?.from ?? routePaths.home;

  const handleSubmit = (credentials: LoginCredentials) => {
    login.mutate(credentials, {
      onSuccess: () => navigate(returnPath, { replace: true }),
    });
  };

  return (
    <main className={style.page}>
      <Card className={style.card}>
        <Typography.Title className={style.title} level={2}>
          News
        </Typography.Title>
        <Typography.Paragraph className={style.description}>
          Войдите в аккаунт, чтобы продолжить
        </Typography.Paragraph>

        {login.isError && (
          <Alert
            className={style.error}
            message={getErrorMessage(login.error)}
            showIcon
            type="error"
          />
        )}

        <Form<LoginCredentials> layout="vertical" onFinish={handleSubmit} requiredMark={false}>
          <Form.Item
            label="Логин"
            name="username"
            rules={[{ required: true, message: 'Введите логин' }]}
          >
            <Input autoComplete="username" size="large" />
          </Form.Item>

          <Form.Item
            label="Пароль"
            name="password"
            rules={[{ required: true, message: 'Введите пароль' }]}
          >
            <Input.Password autoComplete="current-password" size="large" />
          </Form.Item>

          <Button block htmlType="submit" loading={login.isPending} size="large" type="primary">
            Войти
          </Button>
        </Form>
      </Card>
    </main>
  );
};

export default LoginPage;
