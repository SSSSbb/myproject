package com.icodeview.rock.admin.common;

import lombok.extern.slf4j.Slf4j;
import lombok.Data;
import java.io.Serializable;

import static com.icodeview.rock.admin.common.ResultCode.ERROR;
import static com.icodeview.rock.admin.common.ResultCode.SUCCESS;

@Data
@Slf4j
public class Result<T> implements Serializable {
    private Integer code;

    private T data;

    private String msg;

    public Result(Integer code, T data) {
        this.code = code;
        this.data = data;
    }

    public Result(Integer code, T data, String msg) {
        this.code = code;
        this.data = data;
        this.msg = msg;
    }

    public Result(Integer code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    public Result() {
    }

    public static <T> Result<T> ok(T data) {
        return new Result<T>(SUCCESS, data, "success");
    }

    public static Result ok(String msg){
        Result res = new Result();
        res.setMsg(msg);
        res.setCode(SUCCESS);
        return res;
    }

    public static Result fail(String msg) {
        return new Result(ERROR, msg);
    }
}
