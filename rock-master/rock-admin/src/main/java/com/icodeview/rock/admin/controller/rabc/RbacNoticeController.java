package com.icodeview.rock.admin.controller.rabc;

import com.github.xiaoymin.knife4j.annotations.ApiOperationSupport;
import com.github.xiaoymin.knife4j.annotations.ApiSort;
import com.icodeview.rock.admin.dto.RbacNoticeDto;
import com.icodeview.rock.admin.dto.RbacTypeDto;
import com.icodeview.rock.admin.service.RbacNoticeService;
import com.icodeview.rock.admin.vo.RbacNoticeVo;
import com.icodeview.rock.admin.vo.RbacTypeVo;
import com.icodeview.rock.vo.CommonResult;
import com.icodeview.rock.vo.PageResult;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;

@Api(tags = "公告管理")
@ApiSort(2)
@RestController
@RequestMapping("/main/notice")
public class RbacNoticeController {

    @Resource
    private RbacNoticeService rbacNoticeService;


    @ApiOperation("列表")
    @ApiOperationSupport(order = 1, author = "刘紫璇")
    @GetMapping("index")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "createby",value = "创建人"),
            @ApiImplicitParam(name = "content",value = "内容"),
            @ApiImplicitParam(name = "status",value = "状态"),
            @ApiImplicitParam(name = "belongto",value = "属于"),
            @ApiImplicitParam(name = "current",value = "页码"),
            @ApiImplicitParam(name = "pageSize",value = "条数")
    })

    public CommonResult<PageResult<RbacNoticeVo>> index(
            @RequestParam(value = "createby", required = false) String createby,
            @RequestParam(value = "status", required = false) Integer status,
            @RequestParam(value = "belongto", required = false) Integer belongto,
            @RequestParam(value = "current", required = false, defaultValue = "1") Long pageNum,
            @RequestParam(value = "pageSize", required = false, defaultValue = "20") Long pageSize
    ) {
        PageResult<RbacNoticeVo> result = rbacNoticeService.getIndex(createby,status,belongto,pageNum, pageSize);
        return CommonResult.success(result);
    }

    @ApiOperationSupport(order = 2, author = "刘紫璇")
    @ApiOperation("添加")
    @PostMapping("create")
    public CommonResult<Void> create(@RequestBody @Validated RbacNoticeDto dto) {
        rbacNoticeService.createNotice(dto);
        return CommonResult.success("添加成功！");
    }

    @ApiOperationSupport(order = 3, author = "刘紫璇")
    @ApiOperation("删除")
    @GetMapping("delete")
    @ApiImplicitParam(value = "id", name = "id", required = true)
    public CommonResult<Void> delete(@RequestParam(value = "id") Integer id) {
        rbacNoticeService.deleteNotice(id);
        return CommonResult.success("删除成功！");
    }

    @ApiOperationSupport(order = 3, author = "刘紫璇")
    @ApiOperation("更新")
    @PostMapping("update")
    public CommonResult<Void> update(@RequestBody @Validated RbacNoticeDto dto) {
        rbacNoticeService.updateNotice(dto);
        return CommonResult.success("编辑成功！");
    }
}
