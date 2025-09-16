"use server";

import { apiConfig } from "@/lib/apiConfig";
import { apiHandler } from "@/lib/apiHandler";
import { getErrorMessage } from "@/utils/helpers";
import {
  AdminChangePasswordDto,
  ChangeDefaultPasswordDto,
} from "@/types/dtos/auth.dto";

export async function changePassword(data: AdminChangePasswordDto) {
  try {
    const endpoint = apiConfig.auth.change_password();
    await apiHandler({ endpoint, method: "PUT", body: data });
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function changeDefaultPassword(data: ChangeDefaultPasswordDto) {
  try {
    const endpoint = apiConfig.auth.change_default_password();
    await apiHandler({ endpoint, method: "PUT", body: data });
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}
