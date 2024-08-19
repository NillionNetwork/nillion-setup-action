import * as core from "@actions/core";
import { execa } from "execa";
import path from "node:path";

export async function run(): Promise<void> {
  try {
    const version = core.getInput("version");
    const nilupBinPath = `${process.env.HOME}/.nilup/bin`;
    const scriptPath = path.join("/tmp", "install.sh");

    await execa({
      stdout: ["pipe", "inherit"],
    })`curl -sSL https://nilup.nilogy.xyz/install.sh -o ${scriptPath}`;

    await execa({ stdout: ["pipe", "inherit"] })`bash ${scriptPath}`;

    await execa({
      stdout: ["pipe", "inherit"],
    })`${nilupBinPath}/nilup use ${version}`;

    await execa({ stdout: ["pipe", "inherit"] })`${nilupBinPath}/nilup init`;

    // TODO this causes pids to spawn
    // const nadaVer = await execa({
    //   stdout: ["pipe", "inherit"],
    // })`${nilupBinPath}/nada -V`;
    //
    // // const nillionDevnetVer = await execa({
    // //   stdout: ["pipe", "inherit"],
    // // })`${nilupBinPath}/nillion-devnet -V`;
    // //
    // const nillionVer = await execa({
    //   stdout: ["pipe", "inherit"],
    // })`${nilupBinPath}/nillion -V`;
    //
    // const nilupVer = await execa({
    //   stdout: ["pipe", "inherit"],
    // })`${nilupBinPath}/nilup -V`;
    //
    // const pyNadacVer = await execa({
    //   stdout: ["pipe", "inherit"],
    // })`${nilupBinPath}/pynadac -V`;

    core.addPath(nilupBinPath);

    core.setOutput("nada-version", "nadaVer.stdout");
    core.setOutput("nillion-devnet-version", "nillionDevnetVer.stdout");
    core.setOutput("nillion-version", "nillionVer.stdout");
    core.setOutput("nilup-version", "nilupVer.stdout");
    core.setOutput("pynadac-version", "pyNadacVer.stdout");
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message);
  }
}
