import * as core from "@actions/core";
import { execa } from "execa";
import path from "node:path";

export async function run(): Promise<void> {
  try {
    const version = core.getInput("version");
    const nilupPath = `${process.env.HOME}/.nilup`;
    const nilCmdPath = `${nilupPath}/bin/nilup`;
    const scriptPath = path.join("/tmp", "install.sh");

    await execa({
      stdout: ["pipe", "inherit"],
    })`curl -sSL https://nilup.nilogy.xyz/install.sh -o ${scriptPath}`;

    await execa({ stdout: ["pipe", "inherit"] })`bash ${scriptPath}`;
    await execa({ stdout: ["pipe", "inherit"] })`${nilCmdPath} init`;
    await execa({
      stdout: ["pipe", "inherit"],
    })`${nilCmdPath} install ${version}`;
    await execa({ stdout: ["pipe", "inherit"] })`${nilCmdPath} use ${version}`;

    // Execute binaries directly otherwise commands hang in ci
    const activeSdk = `${nilupPath}/sdks/${version}`;

    const nadaVer = await execa({
      stdout: ["pipe", "inherit"],
    })`${activeSdk}/nada -V`;

    const nillionDevnetVer = await execa({
      stdout: ["pipe", "inherit"],
    })`${activeSdk}/nillion-devnet -V`;

    const nillionVer = await execa({
      stdout: ["pipe", "inherit"],
    })`${activeSdk}/nillion -V`;

    const nilupVer = await execa({
      stdout: ["pipe", "inherit"],
    })`${activeSdk}/nilup -V`;

    const pyNadacVer = await execa({
      stdout: ["pipe", "inherit"],
    })`${activeSdk}/pynadac -V`;

    core.addPath(`${nilupPath}/bin`);

    core.setOutput("nada-version", nadaVer.stdout);
    core.setOutput("nillion-devnet-version", nillionDevnetVer.stdout);
    core.setOutput("nillion-version", nillionVer.stdout);
    core.setOutput("nilup-version", nilupVer.stdout);
    core.setOutput("pynadac-version", pyNadacVer.stdout);
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message);
  }
}
