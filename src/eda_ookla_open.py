import marimo

__generated_with = "0.11.17"
app = marimo.App(width="medium")


@app.cell
def _():
    return


@app.cell
def _():
    import marimo as mo
    import pandas as pd
    return mo, pd


@app.cell
def _():
    f_sample = r"C:\Users\jdc\Documents\GithubPersonal\jdc.code.brewsandbytes\ookla\open\year=2019\quarter=1\2019-01-01_performance_fixed_tiles.parquet"
    return (f_sample,)


@app.cell
def _(f_sample, pd):
    df_ookla = pd.read_parquet(f_sample)
    return (df_ookla,)


@app.cell
def _(df_ookla, mo):
    _df = mo.sql(
        f"""
        SELECT * FROM df_ookla;
        """
    )
    return


@app.cell
def _():
    return


if __name__ == "__main__":
    app.run()
