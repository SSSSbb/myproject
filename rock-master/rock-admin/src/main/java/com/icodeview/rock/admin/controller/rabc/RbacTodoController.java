package com.icodeview.rock.admin.controller.rabc;

import com.github.xiaoymin.knife4j.annotations.ApiOperationSupport;
import com.github.xiaoymin.knife4j.annotations.ApiSort;
import com.icodeview.rock.admin.dto.RbacTodoDto;
import com.icodeview.rock.admin.service.RbacTodoService;
import com.icodeview.rock.admin.vo.RbacTodoVo;
import com.icodeview.rock.vo.CommonResult;
import com.icodeview.rock.vo.PageResult;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;

@Api(tags = "待办管理")
@ApiSort(1)
@RestController("RbacTodoController")
@RequestMapping("/todo")
public class RbacTodoController {
    @Resource
    private RbacTodoService rbacTodoService;
    @ApiOperation("列表")
    @ApiOperationSupport(order = 1, author = "刘紫璇")
    @GetMapping("index")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "username",value = "负责人"),
            @ApiImplicitParam(name = "which",value = "待办目标"),
            @ApiImplicitParam(name = "status",value = "待办状态"),
            @ApiImplicitParam(name = "createby",value = "创建人"),
            @ApiImplicitParam(name = "content",value = "内容"),
            @ApiImplicitParam(name = "belongto",value = "所属公司"),
            @ApiImplicitParam(name = "current",value = "页码"),
            @ApiImplicitParam(name = "pageSize",value = "条数")
    })

    public CommonResult<PageResult<RbacTodoVo>> index(
            @RequestParam(value = "id", required = false) Integer id,
            @RequestParam(value = "username", required = false) String username,
            @RequestParam(value = "createby", required = false) String createby,
            @RequestParam(value = "which", required = false) Integer which,
            @RequestParam(value = "status", required = false) Integer status,
            @RequestParam(value = "belongto", required = false) Integer belongto,
            @RequestParam(value = "current", required = false, defaultValue = "1") Long pageNum,
            @RequestParam(value = "pageSize", required = false, defaultValue = "20") Long pageSize
    ) {
        PageResult<RbacTodoVo> result = rbacTodoService.getIndex(id,username,which,belongto,status,createby,pageNum, pageSize);
        return CommonResult.success(result);
    }
    @ApiOperationSupport(order = 2, author = "刘紫璇")
    @ApiOperation("添加")
    @PostMapping("create")
    public CommonResult<Void> create(@RequestBody @Validated RbacTodoDto dto) {
        rbacTodoService.createTodo(dto);
        return CommonResult.success("添加成功！");
    }


    @ApiOperationSupport(order = 3, author = "刘紫璇")
    @ApiOperation("更新")
    @PostMapping("update")
    public CommonResult<Void> update(@RequestBody @Validated RbacTodoDto dto) {
        rbacTodoService.updateTodo(dto);
        return CommonResult.success("编辑成功！");
    }

    @ApiOperationSupport(order = 4, author = "刘紫璇")
    @ApiOperation("删除")
    @GetMapping("delete")
    @ApiImplicitParam(value = "id", name = "id", required = true)
    public CommonResult<Void> delete(@RequestParam(value = "id") Integer id) {
        rbacTodoService.deleteTodo(id);
        return CommonResult.success("删除成功！");
    }
}
