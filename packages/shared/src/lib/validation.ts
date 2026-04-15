export interface LoginFormData {
    email: string;
    password: string;
}

export interface SignupFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
}

export interface ResetPasswordFormData {
    password: string;
    confirmPassword: string;
}

export function validateEmail(email: string): string | null {
    if (!email) {
        return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return "Please enter a valid email address";
    }
    return null;
}

export function validatePassword(password: string): string | null {
    if (!password) {
        return "Password is required";
    }
    if (password.length < 8 || password.length > 16) {
        return "Password must be at least 8 characters long and no more than 16 characters";
    }
    return null;
}

export function validateName(name: string): string | null {
    if (!name) {
        return "Name is required";
    }
    if (name.length < 2 && name.length > 50) {
        return "Name must be at least 2 characters long and no more than 50 characters";
    }
    return null;
}

export function validateLoginForm(data: LoginFormData): ValidationResult {
    const errors: Record<string, string> = {};

    const emailError = validateEmail(data.email);
    if (emailError) errors.email = emailError;

    const passwordError = validatePassword(data.password);
    if (passwordError) errors.password = passwordError;

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
}

export function validateSignupForm(data: SignupFormData): ValidationResult {
    const errors: Record<string, string> = {};

    const nameError = validateName(data.name);
    if (nameError) errors.name = nameError;

    const emailError = validateEmail(data.email);
    if (emailError) errors.email = emailError;

    const passwordError = validatePassword(data.password);
    if (passwordError) errors.password = passwordError;

    if (data.password !== data.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
}

export function validateResetPasswordForm(
    data: ResetPasswordFormData,
): ValidationResult {
    const errors: Record<string, string> = {};

    const passwordError = validatePassword(data.password);
    if (passwordError) errors.password = passwordError;

    if (data.password !== data.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
}
